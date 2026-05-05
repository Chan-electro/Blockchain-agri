// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AgriChain v2 — role-gated agri supply chain with enum state machine
/// @notice Each write function is restricted to its stakeholder role.
/// @dev Hybrid custody: DEFAULT_ADMIN_ROLE (deployer) grants the four stakeholder
///      roles to backend-controlled signer addresses at deploy time.
contract AgriChain is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant LOGISTICS_ROLE = keccak256("LOGISTICS_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    enum Status { CREATED, PROCESSED, IN_TRANSIT, RETAIL, SOLD }

    struct PriceComponent {
        address stakeholder;
        string role;
        uint256 amount;
        string description;
        uint256 timestamp;
    }

    struct Batch {
        uint256 id;
        address farmer;
        string crop;
        string weight;
        string location;
        uint256 createdAt;
        Status status;
        uint256 totalPrice;
        PriceComponent[] priceBreakdown;
    }

    mapping(uint256 => Batch) private batches;
    uint256 public batchCount;

    event BatchCreated(uint256 indexed id, address indexed farmer, uint256 basePrice);
    event BatchProcessed(uint256 indexed id, address indexed processor, uint256 fee, uint256 newTotal);
    event BatchInTransit(uint256 indexed id, address indexed logistics, uint256 fee, uint256 newTotal);
    event BatchRetail(uint256 indexed id, address indexed retailer, uint256 markup, uint256 newTotal);
    event PriceUpdated(uint256 indexed id, address indexed stakeholder, string role, uint256 amount, uint256 newTotal);
    event StatusUpdated(uint256 indexed id, Status newStatus);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function createBatch(
        string memory _crop,
        string memory _weight,
        string memory _location,
        uint256 _basePrice
    ) public onlyRole(FARMER_ROLE) {
        require(_basePrice > 0, "Base price must be > 0");
        batchCount++;
        Batch storage newBatch = batches[batchCount];
        newBatch.id = batchCount;
        newBatch.farmer = msg.sender;
        newBatch.crop = _crop;
        newBatch.weight = _weight;
        newBatch.location = _location;
        newBatch.createdAt = block.timestamp;
        newBatch.status = Status.CREATED;
        newBatch.totalPrice = _basePrice;

        newBatch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "FARMER",
            amount: _basePrice,
            description: "Base Price",
            timestamp: block.timestamp
        }));

        emit BatchCreated(batchCount, msg.sender, _basePrice);
        emit PriceUpdated(batchCount, msg.sender, "FARMER", _basePrice, _basePrice);
        emit StatusUpdated(batchCount, Status.CREATED);
    }

    function addProcessingDetails(
        uint256 _batchId,
        uint256 _processingFee,
        string memory _description
    ) public onlyRole(PROCESSOR_ROLE) {
        Batch storage batch = _requireBatch(_batchId);
        require(batch.status == Status.CREATED, "Batch not in CREATED state");

        batch.totalPrice += _processingFee;
        batch.status = Status.PROCESSED;

        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "PROCESSOR",
            amount: _processingFee,
            description: _description,
            timestamp: block.timestamp
        }));

        emit BatchProcessed(_batchId, msg.sender, _processingFee, batch.totalPrice);
        emit PriceUpdated(_batchId, msg.sender, "PROCESSOR", _processingFee, batch.totalPrice);
        emit StatusUpdated(_batchId, Status.PROCESSED);
    }

    function updateLogistics(
        uint256 _batchId,
        uint256 _transportFee,
        string memory _description
    ) public onlyRole(LOGISTICS_ROLE) {
        Batch storage batch = _requireBatch(_batchId);
        require(batch.status == Status.PROCESSED, "Batch not in PROCESSED state");

        batch.totalPrice += _transportFee;
        batch.status = Status.IN_TRANSIT;

        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "LOGISTICS",
            amount: _transportFee,
            description: _description,
            timestamp: block.timestamp
        }));

        emit BatchInTransit(_batchId, msg.sender, _transportFee, batch.totalPrice);
        emit PriceUpdated(_batchId, msg.sender, "LOGISTICS", _transportFee, batch.totalPrice);
        emit StatusUpdated(_batchId, Status.IN_TRANSIT);
    }

    function retailerReceive(
        uint256 _batchId,
        uint256 _markup,
        string memory _description
    ) public onlyRole(RETAILER_ROLE) {
        Batch storage batch = _requireBatch(_batchId);
        require(batch.status == Status.IN_TRANSIT, "Batch not in IN_TRANSIT state");

        batch.totalPrice += _markup;
        batch.status = Status.RETAIL;

        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "RETAILER",
            amount: _markup,
            description: _description,
            timestamp: block.timestamp
        }));

        emit BatchRetail(_batchId, msg.sender, _markup, batch.totalPrice);
        emit PriceUpdated(_batchId, msg.sender, "RETAILER", _markup, batch.totalPrice);
        emit StatusUpdated(_batchId, Status.RETAIL);
    }

    function getBatchDetails(uint256 _batchId) public view returns (
        uint256 id,
        address farmer,
        string memory crop,
        string memory weight,
        string memory location,
        uint256 createdAt,
        Status status,
        uint256 totalPrice,
        PriceComponent[] memory priceBreakdown
    ) {
        Batch storage batch = _requireBatch(_batchId);
        return (
            batch.id,
            batch.farmer,
            batch.crop,
            batch.weight,
            batch.location,
            batch.createdAt,
            batch.status,
            batch.totalPrice,
            batch.priceBreakdown
        );
    }

    function getBatchHistory(uint256 _batchId) public view returns (PriceComponent[] memory) {
        Batch storage batch = _requireBatch(_batchId);
        return batch.priceBreakdown;
    }

    function _requireBatch(uint256 _batchId) private view returns (Batch storage) {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid Batch ID");
        return batches[_batchId];
    }
}
