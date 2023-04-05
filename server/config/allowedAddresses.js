const teamAddresses = [
  "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
  "0x7cb557AE9671904f44BE5366772A429259077de5",
  "0x1a744599bC7355C95e5b7351e4A106bB4B579CcC",
  "0xfe32B27a625Fb30FD1cA632D7788e80dc35Dad89",
  "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E",
];
const allowedAddresses = [
  {
    address: "0xc59b795bc26CB93529E6d63631900643EB097F20",
    expiration: 1683315666000,
  },
  {
    address: "0x238c2073C61de7CED7a3a546eA0704873b97d15C",
    expiration: 1683315666000,
  },
  {
    address: "0x1E66975C698528cDEBfB5Fbce2Aed00749e48a14",
    expiration: 1683315666000,
  },
  {
    address: "0x9E1cc0bd3109526A3253F1FB53300644EDB40ce9",
    expiration: 1683315666000,
  },
  {
    address: "0xF1E284181979dAcd1e9cda27D7a39F671B20284E",
    expiration: 1683315666000,
  },
  {
    address: "0xe0093Bfe6747D1E2C504081ef2e6400A9a1bc64f",
    expiration: 1683315666000,
  },
  {
    address: "0x44eE381a08F09d5c9C966B8b8EFCd44B7C0d6047",
    expiration: 1683315666000,
  },
  {
    address: "0xB5d149fEbB06D36996426633AeDD416b7D0ceBbD",
    expiration: 1683315666000,
  },
  {
    address: "0x4d0d32C718c786e5c0B97F3fb345485a01d1cEFE",
    expiration: 1683315666000,
  },
  {
    address: "0x64108c234A07Ee67ca545065794A2D79Fb83dDdE",
    expiration: 1683315666000,
  },
  {
    address: "0x5EC53a549466E6a7bfd3bB63a0bC23492E57793B",
    expiration: 1683315666000,
  },
  {
    address: "0x2457C41946205b398030Ca16bF0B71D4BaEe56db",
    expiration: 1683315666000,
  },
  {
    address: "0x5300EB00678E9BE4E234470992B192d55e71B463",
    expiration: 1683315666000,
  },
  {
    address: "0x773f96eC353A8cb90d8B89dE48dF873b04076fD4",
    expiration: 1683315666000,
  },
  {
    address: "0x4d3eeCd10b597BbAd638A423ea0420432c401151",
    expiration: 1683315666000,
  },
  {
    address: "0x9c8714cfF221efFF66faBB80cF6B207B67665224",
    expiration: 1683315666000,
  },
  {
    address: "0x1eDF61D2531fE6a352851dcD2fC5c8d38ec8B72c",
    expiration: 1683315666000,
  },
  {
    address: "0x7874DF86B7e274ceA1fA8c25983dba997b596aF7",
    expiration: 1683315666000,
  },
  {
    address: "0x089f4C3f1E05c1c4eD47CF5d93e00774A0A17106",
    expiration: 1683315666000,
  },
  {
    address: "0xcBCd00710E079F55B055BFeAaf9338066A527a5E",
    expiration: 1683315666000,
  },
  {
    address: "0x9Fa804F0A58636cCBD10460c76873B8366030671",
    expiration: 1683315666000,
  },
  {
    address: "0xDb1eeD483f7E09Ccd7CAC122f8588cBFbE4783ce",
    expiration: 1683315666000,
  },
  {
    address: "0x688D2E8ccBEe728848302d2FdDD08B68BFe7D3ed",
    expiration: 1683315666000,
  },
  {
    address: "0x0d828Bf6a6A4f7B83C42F2C303f8263461115838",
    expiration: 1683315666000,
  },
  {
    address: "0xe384715d363942EFbf200b1038220d76bE6B2FC8",
    expiration: 1683315666000,
  },
  {
    address: "0x17cA2Cce1E196B2e93bD194Ddf4A808B0eEE4805",
    expiration: 1683315666000,
  },
  {
    address: "0xC4173Ac2A95f1ba774051774Ec2614bA83fE76c7",
    expiration: 1683315666000,
  },
  {
    address: "0x1379C29f92b887948Bdc2B9714B90f899e5985dd",
    expiration: 1683315666000,
  },
  {
    address: "0x1aee6a32945c1cbdf2884f709f99f3f6a2a4c117",
    expiration: 1683315666000,
  },
  {
    address: "0x3a1b7a674739047bf175f01eb23ca956c1c0fc83",
    expiration: 1683315666000,
  },
  {
    address: "0xb49bf2dbb45012c07084f1c52f81ccfb293cd323",
    expiration: 1683315666000,
  },
  {
    address: "0xf53cf50af1f8e3a55601d5a3a98f3c90152882cb",
    expiration: 1683315666000,
  },
  {
    address: "0x04055C0D0755bAAd756836Bd2774Cbc11F15bEF1",
    expiration: 1683315666000,
  },
];

const isTeam = address => teamAddresses.find(a => a?.toLowerCase() === address?.toLowerCase())?.length > 0;

module.exports = { allowedAddresses, teamAddresses, isTeam };
