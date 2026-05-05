import { network } from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HARDHAT_MNEMONIC = "test test test test test test test test test test test junk";

const ROLE_TO_INDEX = {
    FARMER: 1,
    PROCESSOR: 2,
    LOGISTICS: 3,
    RETAILER: 4,
};

function upsertEnvValue(envPath, key, value) {
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    if (pattern.test(content)) {
        content = content.replace(pattern, line);
    } else {
        if (content.length > 0 && !content.endsWith("\n")) content += "\n";
        content += `${line}\n`;
    }
    fs.writeFileSync(envPath, content, "utf8");
}

async function main() {
    const connection = await network.getOrCreate();
    const { ethers } = connection;
    const signers = await ethers.getSigners();
    const [admin] = signers;

    console.log(`Deploying from admin: ${admin.address}`);

    const AgriChain = await ethers.getContractFactory("AgriChain");
    const contract = await AgriChain.deploy(admin.address);
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log(`AgriChain deployed at: ${contractAddress}`);

    const roleHashes = {
        FARMER: await contract.FARMER_ROLE(),
        PROCESSOR: await contract.PROCESSOR_ROLE(),
        LOGISTICS: await contract.LOGISTICS_ROLE(),
        RETAILER: await contract.RETAILER_ROLE(),
    };

    const roleAddresses = {};
    for (const [role, index] of Object.entries(ROLE_TO_INDEX)) {
        const signer = signers[index];
        const tx = await contract.connect(admin).grantRole(roleHashes[role], signer.address);
        await tx.wait();
        roleAddresses[role] = signer.address;
        console.log(`Granted ${role}_ROLE to ${signer.address} (account[${index}])`);
    }

    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const rootDir = path.resolve(scriptDir, "..", "..");
    const backendEnvPath = path.join(rootDir, "backend", ".env");
    const rootEnvPath = path.join(rootDir, ".env");

    upsertEnvValue(backendEnvPath, "CONTRACT_ADDRESS", contractAddress);
    upsertEnvValue(backendEnvPath, "BLOCKCHAIN_URL", "http://127.0.0.1:8545");
    upsertEnvValue(backendEnvPath, "MNEMONIC", HARDHAT_MNEMONIC);

    upsertEnvValue(rootEnvPath, "VITE_API_BASE_URL", "http://localhost:3001");
    upsertEnvValue(rootEnvPath, "VITE_CHAIN_NAME", "Hardhat #31337");
    upsertEnvValue(rootEnvPath, "VITE_CONTRACT_ADDRESS", contractAddress);

    console.log(`\nWrote CONTRACT_ADDRESS to ${backendEnvPath}`);
    console.log(`Wrote VITE_CONTRACT_ADDRESS to ${rootEnvPath}`);

    const summary = {
        contractAddress,
        admin: admin.address,
        roles: roleAddresses,
        network: "localhost",
        chainId: 31337,
    };
    const summaryPath = path.join(rootDir, "smart-contract", "deployment.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`Wrote deployment summary to ${summaryPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
