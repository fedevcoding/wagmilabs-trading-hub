const teamAddresses = [
  "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
  "0x7cb557AE9671904f44BE5366772A429259077de5",
  "0x1a744599bC7355C95e5b7351e4A106bB4B579CcC",
  "0x8bC20C9238E9674c9066473968bEeBde0c24393a",
  "0xfe697c5527ab86daa1e4c08286d2be744a0e321e",
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
  {
    address: "0x9f83d4133D6726CA36dD2a424Cf81e9264A19dF1",
    expiration: 1683315666000,
  },
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  {
    address: "0xcd32f12adffda0291460f87d48d714bbde4f11b7",
    expiration: 1683442515000,
  },
  {
    address: "0xFA96a22C337CC2025921403eD95710fD96C20273",
    expiration: 1683442515000,
  },
  {
    address: "0xC480Ef8186C4dC013D2c303B77E7fc24a546f268",
    expiration: 1683442515000,
  },
  {
    address: "0x7aE88AB2E18EC182D509ebdCF4c5Eb272e8947d5",
    expiration: 1683442515000,
  },
  {
    address: "0xc06F5611941567137e23782C05B5e902CB4C09Dc",
    expiration: 1683442515000,
  },
  {
    address: "0xc0F30a131b2Fee4849Ee1cC6550B3d939C6565ce",
    expiration: 1683442515000,
  },
  {
    address: "0x36337998611C162d4f9c933AbD5615522731f105",
    expiration: 1683442515000,
  },
  {
    address: "0xF101C065C723E1c075024aa9420e232C1DBf3B9A",
    expiration: 1683442515000,
  },
  {
    address: "0x612778A0CbC0dE0D5b107648134158Edd61e8533",
    expiration: 1683442515000,
  },
  {
    address: "0x214549E0b18fF9220B1F4B046408cc4f042568F6",
    expiration: 1683442515000,
  },
  {
    address: "0xf2fd05E5E5AF0b6b977F8C0F6D16c9f17d21a0f4",
    expiration: 1683442515000,
  },
  {
    address: "0x5082cfef42908962f9171741f2ece51f02d849c0",
    expiration: 1683442515000,
  },
  {
    address: "0xe25FD1EaDb3caA2d9f36c06C06C8E01e51b025a9",
    expiration: 1683442515000,
  },
  {
    address: "0x780Ac20EEE36D4972921C7F7fc8c297c89b128B6",
    expiration: 1683442515000,
  },
  {
    address: "0xF94bBB43E6a411c831674088B3a35A994fb61246",
    expiration: 1683442515000,
  },
  {
    address: "0xcb320641F8C1AeDA102814C5bEFB040459aF25F0",
    expiration: 1683442515000,
  },
  {
    address: "0x8E3d0AA8B1f4A0FcF5e42267A6112C9b84a909d9",
    expiration: 1683442515000,
  },
  {
    address: "0x709E7eFf5d8B4B7A4Ea6d4739457571cC70e02bb",
    expiration: 1683442515000,
  },
  {
    address: "0xbB599fbd3BB5ce9326EA50dE38D09D5B946B24C1",
    expiration: 1683442515000,
  },
  {
    address: "0x48244a652355bDb4aef383F8d73DbEae5a4266F1",
    expiration: 1683442515000,
  },
  {
    address: "0x1be454104630eBE8b99D0a5F9402A7b8DdE736aa",
    expiration: 1683442515000,
  },
  {
    address: "0xA5338AFE0a3F0436A5F2aFf3669C89f032066F25",
    expiration: 1683442515000,
  },
  {
    address: "0x073925e9Cb637bA3a1e23C4c54BBfa53B3B6Bbcb",
    expiration: 1683442515000,
  },
  {
    address: "0x6CFbA31B89974acD050d5cAf48Ae92A12Ed160B9",
    expiration: 1683442515000,
  },
  {
    address: "0xB7162FB4884CAFfA0d74CbBeC83A1Ab6279B55e1",
    expiration: 1683442515000,
  },
  {
    address: "0x929C5e1f117Bd1f4088B82Ddf6e0eE7035610381",
    expiration: 1683442515000,
  },
  {
    address: "0x2a70B707a64980a9D90e6E63cADfDaF82463123e",
    expiration: 1683442515000,
  },
  {
    address: "0xedF85C7fae46Ab9961A9A93252a264d3F78241f1",
    expiration: 1683442515000,
  },
  {
    address: "0x78c57000aBADf3F4649Bb78fAee6913787B24bBa",
    expiration: 1683442515000,
  },
  {
    address: "0x6244561B693e9E6DE16F6CA7a36192FD7e28556C",
    expiration: 1683442515000,
  },
  {
    address: "0xB6bD440B78A26524E0D0da01f5dB4bbf179F39A2",
    expiration: 1683442515000,
  },
  {
    address: "0x63739Dd207053a5Ad63C90B8e77eD000a5B99600",
    expiration: 1683442515000,
  },
  {
    address: "0x032bd2b371EA940414b2065E3F5e6c565e444444",
    expiration: 1683442515000,
  },
  {
    address: "0x3d086FfCf3467052B8f32D99dEcBEDcfbCB092Bf",
    expiration: 1683442515000,
  },
  {
    address: "0x2506003eC1B677f0Dd174799EB7E5ed7fB41AC3A",
    expiration: 1683442515000,
  },
  {
    address: "0xbF46b30353d9F1EB04B9C06DAbaA5e9dD376C2Ac",
    expiration: 1683442515000,
  },
  {
    address: "0x0a9EE17c7B649dd30Db1450537576d313FF862C7",
    expiration: 1683442515000,
  },
  {
    address: "0x71cD836B8ab475f38e777Dc1c7a6aA03bB422Afc",
    expiration: 1683442515000,
  },
  {
    address: "0x71bFA0Bb8a2b8519aC91E8467E08C576A3e95Dfe",
    expiration: 1683442515000,
  },
  {
    address: "0x0c7cf2EB315eAE5473a58D5bc096aD6645bd8d86",
    expiration: 1683442515000,
  },
  {
    address: "0x5082cfef42908962f9171741f2ece51f02d849c0",
    expiration: 1683442515000,
  },
  {
    address: "0x3089f10484D68B91bb4c2EBA84ec94e6E2F445f6",
    expiration: 1683442515000,
  },
  {
    address: "0xe25FD1EaDb3caA2d9f36c06C06C8E01e51b025a9",
    expiration: 1683442515000,
  },
  {
    address: "0xE63f044D451934a08ced2463cBBf145e23ef6384",
    expiration: 1683442515000,
  },
  {
    address: "0xF0eBcf257682A371cF86121D698c8d133B6866e2",
    expiration: 1683442515000,
  },
  {
    address: "0x7c1E5344055EaeFC747471CcB18a745177dc2140",
    expiration: 1683442515000,
  },
  {
    address: "0xe6EFbca07B88725Aa10353a97BdDEa5b4aBbD729",
    expiration: 1683442515000,
  },
  {
    address: "0x8a21B5748352099B29fa17A620BCe9848D8E9cea",
    expiration: 1683442515000,
  },
  {
    address: "0x8CD1354CD0929532a8BB3C871e5417eb17Dc7321",
    expiration: 1683442515000,
  },
  {
    address: "0xd689E70DD8138d2e1aDe0654B78A321b99A7B3aC",
    expiration: 1683442515000,
  },
  {
    address: "0x8Facedc9BaAdF993Cee2EB9B0586CbB8521453Bc",
    expiration: 1683442515000,
  },
  {
    address: "0xE1c2394808B8182b032f1332C06C75A0eF1Ac919",
    expiration: 1683442515000,
  },
  {
    address: "0x6F357848F9d8F3c2E8772B67c0034dd1e1Bf373C",
    expiration: 1683442515000,
  },
  {
    address: "0xedF85C7fae46Ab9961A9A93252a264d3F78241f1",
    expiration: 1683442515000,
  },
  {
    address: "0xB6bD440B78A26524E0D0da01f5dB4bbf179F39A2",
    expiration: 1683442515000,
  },
  {
    address: "0xc7743379Cd33B3Ab3DF361110fbb0C363CE77687",
    expiration: 1683442515000,
  },
  {
    address: "0xE50976DBa9AF1212b1029A7f3Cc5628a1dBb374E",
    expiration: 1683442515000,
  },
  {
    address: "0xa99F83E7650fa15921F2ab17Ad3c1EdF4E91ba0b",
    expiration: 1683442515000,
  },
  {
    address: "0x49c84E07015957Fa46851A5872884860539081b2",
    expiration: 1683442515000,
  },
  {
    address: "0x2057417158607aB140Dfa5a7a61Db4889E32a3B1",
    expiration: 1683442515000,
  },
  {
    address: "0x0f8395DA6AD500Aef8d59AB925d0157b1d03C0b9",
    expiration: 1683442515000,
  },
  {
    address: "0x1aEB67B4eb8786Fe5c05E0F75C6666D756F318Cf",
    expiration: 1683442515000,
  },
  {
    address: "0xCe375f9cDD93B3027D96d529D6f7e9a3Ac22ab27",
    expiration: 1683442515000,
  },
  {
    address: "0xD770ce363E2949cecF83942B5652C8a22147dD2A",
    expiration: 1683442515000,
  },
  {
    address: "0xf734E64E74c9C2413228006C18Aa5510a95aa6A4",
    expiration: 1683442515000,
  },
  {
    address: "0x72f25A92BaFA1E0cBdBB8907648b5757C16e6d42",
    expiration: 1683442515000,
  },
  {
    address: "0x98B6ceA388B5E550e994b6d267330b29975371D6",
    expiration: 1683442515000,
  },
  {
    address: "0x562a55e23e089C4aFD6156E354C6891031Ae0D61",
    expiration: 1683442515000,
  },
  {
    address: "0xdbBC3Aa812B199EfD03ff368C03E03E6286E97C8",
    expiration: 1683442515000,
  },
  {
    address: "0x857062B616Ac53bbd6156c091794778d0C68c688",
    expiration: 1683442515000,
  },
  {
    address: "0x67e45C848C40dF59a7178366BA83E4ebD1F20Dc0",
    expiration: 1683442515000,
  },
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  {
    address: "0xA30024Af5B789997535dF14bE2253C4557e6Cf23",
    expiration: 1683702821000,
  },
  {
    address: "0x25d0d7E0ffFFB4Bd7d1088316cC0F54915582534",
    expiration: 1683702821000,
  },
  {
    address: "0x980F18a06a74005ff6BaA867fF617198db85a590",
    expiration: 1683702821000,
  },
  {
    address: "0xd5DE6C8017AB7d3C86618fA73e9477FFfa3809A1",
    expiration: 1683702821000,
  },
  {
    address: "0x09d76B985204A3B906a1931B0A58C9D5435283A5",
    expiration: 1683702821000,
  },
  {
    address: "0xFD81c12352Ff25Ca56eE6D45cE6E166825167eD7",
    expiration: 1683702821000,
  },
  {
    address: "0x23E1877499a6d3E69a0816FdafC1ABB5117da0f8",
    expiration: 1683702821000,
  },
  {
    address: "0x437Dc2BC0953D4FB01D342307278C8C57cC8b274",
    expiration: 1683702821000,
  },
  {
    address: "0x709E7eFf5d8B4B7A4Ea6d4739457571cC70e02bb",
    expiration: 1683702821000,
  },
  {
    address: "0x122E1fabC58D0E64F27C49Cdb45773f8214562e0",
    expiration: 1683702821000,
  },
  {
    address: "0x850323397544f6E40eCc4C7cA65F0AD5B6945d94",
    expiration: 1683702821000,
  },
  {
    address: "0xf2fd05E5E5AF0b6b977F8C0F6D16c9f17d21a0f4",
    expiration: 1683702821000,
  },
  {
    address: "0xB0fB2791C05416c41EbA718502a738a0e2CbA77E",
    expiration: 1683702821000,
  },
  {
    address: "0x84553ad958a3ee5AB45d3ea1D10CcB7e72B3FDA0",
    expiration: 1683702821000,
  },
  {
    address: "0x0Ee8A7F7e1a39b68FC9BF52d70C7d4c2F6e5E7C0",
    expiration: 1683702821000,
  },
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  {
    address: "0xd18762683FDe24685bd73D0B1EAa4F082e7E2B2b",
    expiration: 1683963127000,
  },
];

const isTeam = address => teamAddresses.find(a => a?.toLowerCase() === address?.toLowerCase())?.length > 0;

module.exports = { allowedAddresses, teamAddresses, isTeam };
