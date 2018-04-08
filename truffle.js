module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4710000      
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x761A6C71B603f06Cb1d89fc954400a41d671cCF0", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4710000 // Gas limit used for deploys
    }
  }
};