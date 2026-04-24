import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgriChain", function () {
    let agriChain;
    let farmer, processor, logistics, retailer;

    beforeEach(async function () {
        [farmer, processor, logistics, retailer] = await ethers.getSigners();
        const AgriChain = await ethers.getContractFactory("AgriChain");
        agriChain = await AgriChain.deploy();
        await agriChain.waitForDeployment();
    });

    describe("Batch Creation", function () {
        it("Should create a batch with base price", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);

            const batchDetails = await agriChain.getBatchDetails(1);
            expect(batchDetails.crop).to.equal("Rice");
            expect(batchDetails.totalPrice).to.equal(100);
            expect(batchDetails.status).to.equal("CREATED");
        });

        it("Should increment batch count", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
            await agriChain.connect(farmer).createBatch("Wheat", "600kg", "Haryana", 150);

            const count = await agriChain.batchCount();
            expect(count).to.equal(2);
        });
    });

    describe("Price Accumulation", function () {
        beforeEach(async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
        });

        it("Should add processing fee correctly", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");

            const batchDetails = await agriChain.getBatchDetails(1);
            expect(batchDetails.totalPrice).to.equal(120);
            expect(batchDetails.status).to.equal("PROCESSED");
        });

        it("Should add transport fee correctly", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee");

            const batchDetails = await agriChain.getBatchDetails(1);
            expect(batchDetails.totalPrice).to.equal(130);
            expect(batchDetails.status).to.equal("IN_TRANSIT");
        });

        it("Should add retail markup correctly", async function () {
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee");
            await agriChain.connect(retailer).retailerReceive(1, 50, "Retail Markup");

            const batchDetails = await agriChain.getBatchDetails(1);
            expect(batchDetails.totalPrice).to.equal(180);
            expect(batchDetails.status).to.equal("RETAIL");
        });
    });

    describe("Price Breakdown", function () {
        it("Should track all stakeholder contributions", async function () {
            await agriChain.connect(farmer).createBatch("Rice", "500kg", "Punjab", 100);
            await agriChain.connect(processor).addProcessingDetails(1, 20, "Processing Fee");
            await agriChain.connect(logistics).updateLogistics(1, 10, "Transport Fee");
            await agriChain.connect(retailer).retailerReceive(1, 50, "Retail Markup");

            const batchDetails = await agriChain.getBatchDetails(1);
            const breakdown = batchDetails.priceBreakdown;

            expect(breakdown.length).to.equal(4);
            expect(breakdown[0].role).to.equal("FARMER");
            expect(breakdown[0].amount).to.equal(100);
            expect(breakdown[1].role).to.equal("PROCESSOR");
            expect(breakdown[1].amount).to.equal(20);
            expect(breakdown[2].role).to.equal("LOGISTICS");
            expect(breakdown[2].amount).to.equal(10);
            expect(breakdown[3].role).to.equal("RETAILER");
            expect(breakdown[3].amount).to.equal(50);
        });
    });
});
