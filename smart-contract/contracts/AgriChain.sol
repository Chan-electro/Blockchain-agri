// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AgriChain {
    // Roles
    address public owner;
    
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
        string status; // CREATED, IN_TRANSIT, PROCESSED, RETAIL, SOLD
        uint256 totalPrice;
        PriceComponent[] priceBreakdown;
    }

    mapping(uint256 => Batch) public batches;
    uint256 public batchCount;

    event BatchCreated(uint256 indexed id, address indexed farmer, uint256 basePrice);
    event PriceUpdated(uint256 indexed id, address indexed stakeholder, string role, uint256 amount, uint256 newTotal);
    event StatusUpdated(uint256 indexed id, string newStatus);

    constructor() {
        owner = msg.sender;
    }

    function createBatch(string memory _crop, string memory _weight, string memory _location, uint256 _basePrice) public {
        batchCount++;
        Batch storage newBatch = batches[batchCount];
        newBatch.id = batchCount;
        newBatch.farmer = msg.sender;
        newBatch.crop = _crop;
        newBatch.weight = _weight;
        newBatch.location = _location;
        newBatch.createdAt = block.timestamp;
        newBatch.status = "CREATED";
        newBatch.totalPrice = _basePrice;

        newBatch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "FARMER",
            amount: _basePrice,
            description: "Base Price",
            timestamp: block.timestamp
        }));

        emit BatchCreated(batchCount, msg.sender, _basePrice);
    }

    function addProcessingDetails(uint256 _batchId, uint256 _processingFee, string memory _description) public {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid Batch ID");
        Batch storage batch = batches[_batchId];
        
        // In a real app, we would check if msg.sender has PROCESSOR role
        
        batch.totalPrice += _processingFee;
        batch.status = "PROCESSED";
        
        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "PROCESSOR",
            amount: _processingFee,
            description: _description,
            timestamp: block.timestamp
        }));

        emit PriceUpdated(_batchId, msg.sender, "PROCESSOR", _processingFee, batch.totalPrice);
        emit StatusUpdated(_batchId, "PROCESSED");
    }

    function updateLogistics(uint256 _batchId, uint256 _transportFee, string memory _description) public {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid Batch ID");
        Batch storage batch = batches[_batchId];
        
        batch.totalPrice += _transportFee;
        batch.status = "IN_TRANSIT";
        
        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "LOGISTICS",
            amount: _transportFee,
            description: _description,
            timestamp: block.timestamp
        }));

        emit PriceUpdated(_batchId, msg.sender, "LOGISTICS", _transportFee, batch.totalPrice);
        emit StatusUpdated(_batchId, "IN_TRANSIT");
    }

    function retailerReceive(uint256 _batchId, uint256 _markup, string memory _description) public {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid Batch ID");
        Batch storage batch = batches[_batchId];
        
        batch.totalPrice += _markup;
        batch.status = "RETAIL";
        
        batch.priceBreakdown.push(PriceComponent({
            stakeholder: msg.sender,
            role: "RETAILER",
            amount: _markup,
            description: _description,
            timestamp: block.timestamp
        }));

        emit PriceUpdated(_batchId, msg.sender, "RETAILER", _markup, batch.totalPrice);
        emit StatusUpdated(_batchId, "RETAIL");
    }

    function getBatchDetails(uint256 _batchId) public view returns (
        uint256 id,
        address farmer,
        string memory crop,
        string memory weight,
        string memory location,
        string memory status,
        uint256 totalPrice,
        PriceComponent[] memory priceBreakdown
    ) {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid Batch ID");
        Batch storage batch = batches[_batchId];
        return (
            batch.id,
            batch.farmer,
            batch.crop,
            batch.weight,
            batch.location,
            batch.status,
            batch.totalPrice,
            batch.priceBreakdown
        );
    }
}
