import { expect } from "chai";
import { network } from "hardhat";

describe("AgriChain v2", function () {
    let ethers;
    let agriChain;
    let admin, farmer, processor, logistics, retailer, outsider;
    let FARMER_ROLE, PROCESSOR_ROLE, LOGISTICS_ROLE, RETAILER_ROLE;

    before(async function () {
        const connection = await network.getOrCreate();
        ethers = connection.ethers;
    });

    beforeEach(async function () {
        [admin, farmer, processor, logistics, retailer, outsider] = await ethers.getSigners();
        const AgriChain = await ethers.getContractFactory("AgriChain");
        agriChain = await AgriChain.deploy(admin.address);
        await agriChain.waitForDeployment();

        FARMER_ROLE = await agriChain.FARMER_ROLE();
        PROCESSOR_ROLE = await agriChain.PROCESSOR_ROLE();
        LOGISTICS_ROLE = await agriChain.LOGISTICS_ROLE();
        RETAILER_ROLE = await agriChain.RETAILER_ROLE();

        await agriChain.connect(admin).grantRole(FARMER_ROLE, farmer.address);
        await agriChain.connect(admin).grantRole(PROCESSOR_ROLE, processor.address);
        await agriChain.connect(admin).grantRole(LOGISTICS_ROLE, logistics.address);
        await agriChain.connect(admin).grantRole(RETAILER_ROLE, retailer.address);
    });

    describe("Role Management", function () {
        it("Should grant roles to stakeholder addresses", async function () {
            expect(await agriChain.hasRole(FARMER_ROLE, farmer.address)).to.equal(true);
            expect(await agriChain.hasRole(PROCESSOR_ROLE, processor.address)).to.equal(true);
            expect(await agriChain.hasRole(LOGISTICS_ROLE, logistics.address)).to.equal(true);
            expect(await agriChain.hasRole(RETAILER_ROLE, retailer.address)).to.equal(true);
        });

        it("Should NOT grant roles to outsider", async function () {
            expect(await agriChain.hasRole(FARMER_ROLE, outsider.address)).to.equal(false);
        });
    });

    describe("Batch Creation", function () {
        it("Should create a batch with base price when called by farmer", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);

            const batch = await agriChain.getBatchDetails(1);
            expect(batch.crop).to.equal("Rice");
            expect(batch.totalPrice).to.equal(100n);
            expect(batch.status).to.equal(0n); // CREATED
        });

        it("Should revert when non-farmer calls createBatch", async function () {
            await expect(
                agriChain.connect(outsider).createBatch("Rice", "500kg", "Punjab", 100)
            ).to.be.revert(ethers);
            await expect(
                agriChain.connect(processor).createBatch("Rice", "500kg", "Punjab", 100)
            ).to.be.revert(ethers);
        });

        it("Should revert when base price is 0", async function () {
            await expect(
                agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 0)
            ).to.be.revertedWith("Base price must be > 0");
        });

        it("Should increment batch count", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
            await agriChain.connect(farmer).createBatch("Wheat", "600kg", "Haryana", 150);

            expect(await agriChain.batchCount()).to.equal(2n);
        });

        it("Should emit BatchCreated", async function () {
            await expect(agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100))
                .to.emit(agriChain, "BatchCreated")
                .withArgs(1n, farmer.address, 100n);
        });
    });

    describe("State Machine", function () {
        beforeEach(async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
        });

        it("Should advance CREATED -> PROCESSED -> IN_TRANSIT -> RETAIL", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");
            expect((await agriChain.getBatchDetails(1)).status).to.equal(1n); // PROCESSED

            await agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee");
            expect((await agriChain.getBatchDetails(1)).status).to.equal(2n); // IN_TRANSIT

            await agriChain.connect(retailer).retailerReceive(1, 50, "Retail Markup");
            expect((await agriChain.getBatchDetails(1)).status).to.equal(3n); // RETAIL
        });

        it("Should REVERT when skipping CREATED -> IN_TRANSIT", async function () {
            await expect(
                agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee")
            ).to.be.revertedWith("Batch not in PROCESSED state");
        });

        it("Should REVERT when retailer receives un-transited batch", async function () {
            await expect(
                agriChain.connect(retailer).retailerReceive(1, 50, "Retail Markup")
            ).to.be.revertedWith("Batch not in IN_TRANSIT state");
        });

        it("Should REVERT when processor processes already-processed batch", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Fee");
            await expect(
                agriChain.connect(processor).addProcessingDetails(1, 20, "Fee")
            ).to.be.revertedWith("Batch not in CREATED state");
        });
    });

    describe("Role Gating", function () {
        beforeEach(async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
        });

        it("Should revert when non-processor calls addProcessingDetails", async function () {
            await expect(
                agriChain.connect(farmer).addProcessingDetails(1, 20, "Fee")
            ).to.be.revert(ethers);
            await expect(
                agriChain.connect(outsider).addProcessingDetails(1, 20, "Fee")
            ).to.be.revert(ethers);
        });

        it("Should revert when non-logistics calls updateLogistics", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Fee");
            await expect(
                agriChain.connect(farmer).updateLogistics(1, 10, "Fee")
            ).to.be.revert(ethers);
            await expect(
                agriChain.connect(retailer).updateLogistics(1, 10, "Fee")
            ).to.be.revert(ethers);
        });

        it("Should revert when non-retailer calls retailerReceive", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Fee");
            await expect(
                agriChain.connect(logistics).retailerReceive(1, 50, "Markup")
            ).to.be.revert(ethers);
        });
    });

    describe("Price Breakdown", function () {
        it("Should track all 4 stakeholder contributions in order", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee");
            await agriChain.connect(retailer).retailerReceive(1, 50, "Retail Markup");

            const history = await agriChain.getBatchHistory(1);
            expect(history.length).to.equal(4);
            expect(history[0].role).to.equal("FARMER");
            expect(history[0].amount).to.equal(100n);
            expect(history[1].role).to.equal("PROCESSOR");
            expect(history[1].amount).to.equal(20n);
            expect(history[2].role).to.equal("LOGISTICS");
            expect(history[2].amount).to.equal(10n);
            expect(history[3].role).to.equal("RETAILER");
            expect(history[3].amount).to.equal(50n);
        });

        it("Should return history sorted by timestamp (ascending)", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Fee");

            const history = await agriChain.getBatchHistory(1);
            expect(history[0].timestamp).to.be.lte(history[1].timestamp);
            expect(history[1].timestamp).to.be.lte(history[2].timestamp);
        });
    });

    describe("Invalid batch lookups", function () {
        it("Should revert when fetching non-existent batch", async function () {
            await expect(agriChain.getBatchDetails(999)).to.be.revertedWith("Invalid Batch ID");
            await expect(agriChain.getBatchHistory(999)).to.be.revertedWith("Invalid Batch ID");
        });
    });
});
