import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";
import hardhatEthersChaiMatchers from "@nomicfoundation/hardhat-ethers-chai-matchers";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
    plugins: [hardhatEthers, hardhatMocha, hardhatEthersChaiMatchers],
    solidity: "0.8.28",
    paths: {
        sources: "./contracts",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    networks: {
        localhost: {
            type: "http",
            url: "http://127.0.0.1:8545"
        }
    },
    test: {
        mocha: {
            timeout: 100000
        }
    }
};
