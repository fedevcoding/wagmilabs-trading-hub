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
  {
    address: "0x8F6A2050f798c7d1E876fAFC31EF326723c1f955",
    expiration: 1683963127000,
  },
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  {
    address: "0x99a3dec6bc8167e82e835083f705f08a8d36a055",
    expiration: 1684049390000,
  },
  {
    address: "0x95f6b040a013d89883e36545df53844dbda4d8d1",
    expiration: 1684049390000,
  },
  {
    address: "0xc043e6549a9572b13196b4ac153355dbb10cdd2d",
    expiration: 1684049390000,
  },
  {
    address: "0xceda96615cdd107dc3e30e8fa932a07d1b6ce2c4",
    expiration: 1684049390000,
  },
  {
    address: "0xecb2c0c98d193068c54951fc0a62268961540a9c",
    expiration: 1684049390000,
  },
  {
    address: "0xc5ec165b42b2258040ed8a8ff334ed4c97a96a3e",
    expiration: 1684049390000,
  },
  {
    address: "0x0cfd2cb54d61f75a5e47963541ad52170d370070",
    expiration: 1684049390000,
  },
  {
    address: "0xfbe40dc7515de2b50363fd1b222fc2d8b4550855",
    expiration: 1684049390000,
  },
  {
    address: "0x2ab044806b2886fb1068c4a26ac8a8a0c004e618",
    expiration: 1684049390000,
  },
  {
    address: "0xdf371ce668ebe7583e8797cff969ca8816585125",
    expiration: 1684049390000,
  },
  {
    address: "0x63ff337dd86e0daa0fcb863cedabf9619e7d05f7",
    expiration: 1684049390000,
  },
  {
    address: "0x7c781499fe15fc0cfd31534173ba3c4ef2ab242c",
    expiration: 1684049390000,
  },
  {
    address: "0xda3863583c9fcd8a5d3506d91aaf33157124d1d1",
    expiration: 1684049390000,
  },
  {
    address: "0x2536ee17bf914cd6d72ec9cbf9502de9f1bbdfdf",
    expiration: 1684049390000,
  },
  {
    address: "0x313eec22fef38d5f75ee8c4b6cbccd4861474793",
    expiration: 1684049390000,
  },
  {
    address: "0xbfad8f7175e5a5a7d47bfadbce23791779dab25f",
    expiration: 1684049390000,
  },
  {
    address: "0x434dba149a4a2b9909a7ffeed08491aed9d5b904",
    expiration: 1684049390000,
  },
  {
    address: "0x62c46784e6fbbe766fa2ccba3330a5d749d37b72",
    expiration: 1684049390000,
  },
  {
    address: "0x0c3f5d662be9071b0d6272cd631bd5ac0128b8ec",
    expiration: 1684049390000,
  },
  {
    address: "0xbe736babf723bc47a8ec31971b1b6041f94daa62",
    expiration: 1684049390000,
  },
  {
    address: "0x6054d61eb4c4153b7f5bfc31cb0f20bc85777e7d",
    expiration: 1684049390000,
  },
  {
    address: "0x8d50ca23bddfca6db5ae6de31ca0e6a17586e5b8",
    expiration: 1684049390000,
  },
  {
    address: "0xfae582774da433f54611a3feba001fad0aa55b4c",
    expiration: 1684049390000,
  },
  {
    address: "0x51ea8ac00045f0e6815ef83b05534853a47e8128",
    expiration: 1684049390000,
  },
  {
    address: "0x14a9f89ef87d793a678a356a6fa31e25d518866f",
    expiration: 1684049390000,
  },
  {
    address: "0xadcacb8b5e5e120f564d6538c29c7a0bbd3c3e3a",
    expiration: 1684049390000,
  },
  {
    address: "0xb464b488d880126f4b333d41d12437414a809825",
    expiration: 1684049390000,
  },
  {
    address: "0x5b9413f33784db3eb998299e6989fcd159173a03",
    expiration: 1684049390000,
  },
  {
    address: "0x85914d049aa004d037cae65bad275ed4147f172e",
    expiration: 1684049390000,
  },
  {
    address: "0x900c8736db0529d7e4403be44a54ccaaf829ef9a",
    expiration: 1684049390000,
  },
  {
    address: "0x575331f3daad217b2b2e8aed380dbc0d9a76c6a1",
    expiration: 1684049390000,
  },
  {
    address: "0x240a829b963d1e84982a17f2ff7bfc9def8e61d3",
    expiration: 1684049390000,
  },
  {
    address: "0xf0ecb4314d06efb3842d203652d7d69b45f2236d",
    expiration: 1684049390000,
  },
  {
    address: "0xa74c9beb0fcde4aaedeb5545500505c49e05e59b",
    expiration: 1684049390000,
  },
  {
    address: "0x5f63e16b1606e7af138416c1836e09d2b52de41c",
    expiration: 1684049390000,
  },
  {
    address: "0x1a744599bc7355c95e5b7351e4a106bb4b579ccc",
    expiration: 1684049390000,
  },
  {
    address: "0x0a9ee17c7b649dd30db1450537576d313ff862c7",
    expiration: 1684049390000,
  },
  {
    address: "0x21e22e1f3f4776e99310071b6b5d4368bc0c21d3",
    expiration: 1684049390000,
  },
  {
    address: "0xfed5297d6a18515f845b7df19254e75c0ba61d4e",
    expiration: 1684049390000,
  },
  {
    address: "0xebe086db0f46e96d165ac9b7f86d79b4ad1e3e4e",
    expiration: 1684049390000,
  },
  {
    address: "0x92b3cd6a5e8dfe8df7ea7bd40ed75e670107b782",
    expiration: 1684049390000,
  },
  {
    address: "0x0f079a527701bf0d2b7ff07f10a97520ccedba40",
    expiration: 1684049390000,
  },
  {
    address: "0x0001ed1cae18a1ccf12d6e3eb863212dc2ee7644",
    expiration: 1684049390000,
  },
  {
    address: "0x607ece0c97be5aef959e8e9fdd4450f27d40ef3e",
    expiration: 1684049390000,
  },
  {
    address: "0x017778554ae97956a538d02904e34fb25d940d45",
    expiration: 1684049390000,
  },
  {
    address: "0xb22288a6cb131d639e65d14fb67e5b4edc752b10",
    expiration: 1684049390000,
  },
  {
    address: "0x945f6c41516224ffef1f5c24f108b6ddd7e0c828",
    expiration: 1684049390000,
  },
  {
    address: "0xc136dee67e61f5b66be5b5cf0370e0b593bb4e35",
    expiration: 1684049390000,
  },
  {
    address: "0x0f036cf522122757e9430887552ac6b3f008212f",
    expiration: 1684049390000,
  },
  {
    address: "0xab0a13710c5efd1f149212782593bce505aea44c",
    expiration: 1684049390000,
  },
  {
    address: "0xc277d36076d3fdabd5bbdc12af71f072e166ff87",
    expiration: 1684049390000,
  },
  {
    address: "0xc26ac81e8ff7555c0fadbe4d84138cd3953598e2",
    expiration: 1684049390000,
  },
  {
    address: "0x2b43e70dff41395c9fac661ec80b5d42e3801538",
    expiration: 1684049390000,
  },
  {
    address: "0x819d6e7b11732b11fd1529abaaac8e9f32154aaf",
    expiration: 1684049390000,
  },
  {
    address: "0x54591cfb00a200b2114d2807da50ee1dc450e6c8",
    expiration: 1684049390000,
  },
  {
    address: "0xef95f828610499dc361981b53796a81ed263090b",
    expiration: 1684049390000,
  },
  {
    address: "0xea9472806bf11c3aacbf587e07e074bd4bb52e58",
    expiration: 1684049390000,
  },
  {
    address: "0xa68eb536ca1c0655412b6602d6d92aa0e22e6663",
    expiration: 1684049390000,
  },
  {
    address: "0xfb40932271fc9db9dbf048e80697e2da4aa57250",
    expiration: 1684049390000,
  },
  {
    address: "0x78871a523cd7465f45fdc18f9ed593d16e60c113",
    expiration: 1684049390000,
  },
  {
    address: "0x0e7d0aac0f8bebea1a88496c04f963f676e14c87",
    expiration: 1684049390000,
  },
  {
    address: "0x2ceba06d249bbfa20894e2092b77dd86db0a9302",
    expiration: 1684049390000,
  },
  {
    address: "0xc09956866623ac5c49cb543634b0a38a6eeaa862",
    expiration: 1684049390000,
  },
  {
    address: "0x73e3bae27b7a0537e26098653056b94f98d8c8f4",
    expiration: 1684049390000,
  },
  {
    address: "0x4f065efa83c9c992cc6b2287b939169e43f8bc2e",
    expiration: 1684049390000,
  },
  {
    address: "0x41f3cbbaa1eda77ecce61e3f6814a843f77cd1ed",
    expiration: 1684049390000,
  },
  {
    address: "0x393a84a78a8d22898c843d76546ec3a15d714815",
    expiration: 1684049390000,
  },
  {
    address: "0xffcd936e37aeeb7c587d4fdd982cd467480eaa01",
    expiration: 1684049390000,
  },
  {
    address: "0xf126b7b7f56bd5514d09d4179d0aac2d6eb8eceb",
    expiration: 1684049390000,
  },
  {
    address: "0xac88ac190d3786998be551331b4eeff22642c6e9",
    expiration: 1684049390000,
  },
  {
    address: "0x91a1f96fc12fed0c3dd0e5731a2aa5e06851827d",
    expiration: 1684049390000,
  },
  {
    address: "0x5218b28ce3c0f3960b2770fa7c0e03a87f435b1a",
    expiration: 1684049390000,
  },
  {
    address: "0x0db54cc560ae7832898e82e5e607e8142e519891",
    expiration: 1684049390000,
  },
  {
    address: "0x5d9be2a83980544c73c0d4da79ecea5b2885df06",
    expiration: 1684049390000,
  },
  {
    address: "0x8445bdd254d38b16e27247142ec02689945a74a0",
    expiration: 1684049390000,
  },
  {
    address: "0x6f691acae8e04bfebf616fb57399bb7880a4b1d8",
    expiration: 1684049390000,
  },
  {
    address: "0xeb6328f677b5dddebb4599eb6f32a9343a881704",
    expiration: 1684049390000,
  },
  {
    address: "0x473093d84bddaf502e40f52822047153e7353a98",
    expiration: 1684049390000,
  },
  {
    address: "0x8e0d9d97efc9d2a32f18ca12e2f177eec382d951",
    expiration: 1684049390000,
  },
  {
    address: "0x7b8f1c54e8068960ae703d62aad4fc1e1b23adad",
    expiration: 1684049390000,
  },
  {
    address: "0xaee96e7418d5b19fd20c8d954f4fd3ea0baab12a",
    expiration: 1684049390000,
  },
  {
    address: "0x3efa19acf8c33c96659f95be7660b62d6cdaca73",
    expiration: 1684049390000,
  },
  {
    address: "0x44c93aa2835572bd97fad821308709cf09e8a658",
    expiration: 1684049390000,
  },
  {
    address: "0x2cdb2dd5c2fbe62141b03c447f2fdd0d97045259",
    expiration: 1684049390000,
  },
  {
    address: "0x850f78a5f46bf0cbe0244d8587b91902ff7e2e38",
    expiration: 1684049390000,
  },
  {
    address: "0x86eabdbed2e6ab099e8c9fdc3d58c0e94765fd8b",
    expiration: 1684049390000,
  },
  {
    address: "0xd5443d7fb09a98bb56abd40773a719e62f27be7e",
    expiration: 1684049390000,
  },
  {
    address: "0xc40d7ae4fe676c3a163ee9059cbc64064ef41b78",
    expiration: 1684049390000,
  },
  {
    address: "0x8a651d64e05e1ebd6612e36ecec5184f549e4106",
    expiration: 1684049390000,
  },
  {
    address: "0x616e662d822f683b65a67b56ad19f0f4db87260a",
    expiration: 1684049390000,
  },
  {
    address: "0x8cc5145e77d84948cb824918c42036a74f6524f4",
    expiration: 1684049390000,
  },
  {
    address: "0x3318174a0be006116ebef9e49a142a6eeedae4f2",
    expiration: 1684049390000,
  },
  {
    address: "0x5004fd066f066669c73e0bbdf55f1079707c0a4d",
    expiration: 1684049390000,
  },
  {
    address: "0xbdd95abe8a7694ccd77143376b0fbea183e6a740",
    expiration: 1684049390000,
  },
  {
    address: "0xa43b30fb0333e5d68cbe36e20c6accab28f82cc3",
    expiration: 1684049390000,
  },
  {
    address: "0x5e624a7ad13b5c01d547b1a95a386d1f6147bf56",
    expiration: 1684049390000,
  },
  {
    address: "0x770987582f224868e8caddd6d5ed94e20f6c9e2d",
    expiration: 1684049390000,
  },
  {
    address: "0x0a49fbe88cfc413181dbe93c9e3b6184b2264071",
    expiration: 1684049390000,
  },
  {
    address: "0x55bede8c420cdc4153c07ad5355e96c8c144f481",
    expiration: 1684049390000,
  },
  {
    address: "0x6cfdd01f6f4df818a083e8ecde22168bf9471b41",
    expiration: 1684049390000,
  },
  {
    address: "0x806f79325b21bf72f0eefb2b64c90f1097cfa312",
    expiration: 1684049390000,
  },
  {
    address: "0x2c9f770d43c7f535c705abd6275d27a5f5198d9f",
    expiration: 1684049390000,
  },
  {
    address: "0x87e3235a749bd31c0f8842614321d82a659b17bc",
    expiration: 1684049390000,
  },
  {
    address: "0xf3bf4cadebee8427f6fc87f4d846f21d78efe2dc",
    expiration: 1684049390000,
  },
  {
    address: "0x6c2f014d5bb57528365f99dc69fca7c024cc49e0",
    expiration: 1684049390000,
  },
  {
    address: "0x6bc5bca2c80f481af8e0029b53382a096f21dc41",
    expiration: 1684049390000,
  },
  {
    address: "0xcd8af79ba3974404e37f126a8e355690351da8bd",
    expiration: 1684049390000,
  },
  {
    address: "0xc76628eb7153cc702a638eb9e4202e07439ab946",
    expiration: 1684049390000,
  },
  {
    address: "0x6d2186009d129b153f9c1167e9916f51d1226324",
    expiration: 1684049390000,
  },
  {
    address: "0x5c611e7f1669a0bfc5eafd56aa5de991345870d9",
    expiration: 1684049390000,
  },
  {
    address: "0xbc769e783796bab3d614683d1f2f5e1446b3724d",
    expiration: 1684049390000,
  },
  {
    address: "0xebdc166d5dc963c27ef44c12a32444fd4a5f861e",
    expiration: 1684049390000,
  },
  {
    address: "0x995b4e191b8e42ecdf77dee65cee282eb07f61d7",
    expiration: 1684049390000,
  },
  {
    address: "0x5604419e463c34335505a48373cc3ffdc90d3256",
    expiration: 1684049390000,
  },
  {
    address: "0x3626d84144d632e4f2ce50e242dc5062ef73730d",
    expiration: 1684049390000,
  },
  {
    address: "0x2fb3202906c98cb4e8b0a98f25072457476a6993",
    expiration: 1684049390000,
  },
  {
    address: "0xf5096af5c7b002537a9b38dc530009d3ee1756b3",
    expiration: 1684049390000,
  },
  {
    address: "0xb12710eae2fa034a44c9636a837828e31954fd1a",
    expiration: 1684049390000,
  },
  {
    address: "0x26c46e6f7b37e3eea85b6edf0e95583d0bb292ad",
    expiration: 1684049390000,
  },
  {
    address: "0xc63e41f8745f2a6a61e6d3b57ca05d33781dd43b",
    expiration: 1684049390000,
  },
  {
    address: "0x11355d121260193c7d12994b01b5bb48ebd27fbe",
    expiration: 1684049390000,
  },
  {
    address: "0xdd9cc90aded5e60e02121dcc604f4dd7bd1fd605",
    expiration: 1684049390000,
  },
  {
    address: "0xdcc2af4ee6191a796ac518283cf53e149317d8b6",
    expiration: 1684049390000,
  },
  {
    address: "0x6dd02a551b7be87f43a31a7e34cf0fec57063f80",
    expiration: 1684049390000,
  },
  {
    address: "0x2592428ad0bd74da8d02e9b370831d31e33544fe",
    expiration: 1684049390000,
  },
  {
    address: "0x47b20272ebee4233aad387dd88aa80ddaf55032b",
    expiration: 1684049390000,
  },
  {
    address: "0xd4ca9f67dd4bf08d8e3b58ca3b4c5a92e4e0f4c3",
    expiration: 1684049390000,
  },
  {
    address: "0x0b4eaba7992b760115ad8b14aadc7f8c47ce7463",
    expiration: 1684049390000,
  },
  {
    address: "0xd80f0d03579d1cae085ba34c3e909c33e710a52d",
    expiration: 1684049390000,
  },
  {
    address: "0x06b6f8c37a24aaa26ae9310619b21da4421252f1",
    expiration: 1684049390000,
  },
  {
    address: "0x4f70a8c1747626fa8b2b5968aef8e3bdb3eae7bc",
    expiration: 1684049390000,
  },
  {
    address: "0xfe697c5527ab86daa1e4c08286d2be744a0e321e",
    expiration: 1684049390000,
  },
  {
    address: "0x31e86445dff27326505ad8c490794abee0e72e83",
    expiration: 1684049390000,
  },
  {
    address: "0xb234cbcfee93a6ffcfd0dd4fe7712d3ad2694085",
    expiration: 1684049390000,
  },
  {
    address: "0x5bebcc04b9d8de3e4123095a3ce1b8ae989ff7bb",
    expiration: 1684049390000,
  },
  {
    address: "0xd58f0ad83eb0f30255340a0a36f1832edc129e3d",
    expiration: 1684049390000,
  },
  {
    address: "0x9b6c49b492bb4f77e2bdd63480107119a0d00c00",
    expiration: 1684049390000,
  },
  {
    address: "0xa8129913f7961fc3c62325fea1490eca51b81a71",
    expiration: 1684049390000,
  },
  {
    address: "0xc168fa19dc220ff51ba7faa476373fce602506a3",
    expiration: 1684049390000,
  },
  {
    address: "0x1334637be9f86732b3cd5654a41750a77c1e00d9",
    expiration: 1684049390000,
  },
  {
    address: "0xd88a6387c4d2b6ca7ed56326935c5f6121474cbd",
    expiration: 1684049390000,
  },
  {
    address: "0xa2a7a57344bf631298fb2834fbd069dce22c3ea1",
    expiration: 1684049390000,
  },
  {
    address: "0xb0cfea22b93a4c85c46c55f6e665a77fefc5d197",
    expiration: 1684049390000,
  },
  {
    address: "0x169353769be5ff4bc5781d6776dd84af408c7414",
    expiration: 1684049390000,
  },
  {
    address: "0x31e554935f03c3c3bc9059c64914df4a3b75397c",
    expiration: 1684049390000,
  },
  {
    address: "0x857062b616ac53bbd6156c091794778d0c68c688",
    expiration: 1684049390000,
  },
  {
    address: "0xc69594a09b401e604a24a885c3aceb5478b772c2",
    expiration: 1684049390000,
  },
  {
    address: "0x32201aafd9ccf4aa5ebf49d03c47707b8109cf71",
    expiration: 1684049390000,
  },
  {
    address: "0x3fe3a8fe534ae4fcd8fe355832deae0bc344fd02",
    expiration: 1684049390000,
  },
  {
    address: "0x551fa7868b8928773d887bc60b4bb8f46e1d18b7",
    expiration: 1684049390000,
  },
  {
    address: "0x6748c23cb9d9f40ac75ec2c43106a8bc3197f82e",
    expiration: 1684049390000,
  },
  {
    address: "0xe4f8cf094298a636c6bcf8f52de33472a91f8fb5",
    expiration: 1684049390000,
  },
  {
    address: "0xd027e3e4af82d48659f70e72d0a5e5fb55e0fe0a",
    expiration: 1684049390000,
  },
  {
    address: "0xfdd66fc96929c5789ea829d2b7c5e139cc642c5f",
    expiration: 1684049390000,
  },
  {
    address: "0xd01ef14d001fab63c093686fffd76c788302e79c",
    expiration: 1684049390000,
  },
  {
    address: "0xba88ed2bf55e3889e092593f4ef6608626da4545",
    expiration: 1684049390000,
  },
  {
    address: "0x92237f6261db6081421da708f1c0c58fd784e6f3",
    expiration: 1684049390000,
  },
  {
    address: "0xf881e57adb8b32a696416379ae3fecc8f0064e4b",
    expiration: 1684049390000,
  },
  {
    address: "0x1f3b00363a447c88a255ea329c3e8e96c8872196",
    expiration: 1684049390000,
  },
  {
    address: "0x3a19800b2eed1781789037dee2f63ef3918dc36f",
    expiration: 1684049390000,
  },
  {
    address: "0x5e47d41bf8a11a2ea1c28e7bc27ed7da7b865143",
    expiration: 1684049390000,
  },
  {
    address: "0xf3b059c887172f2cc52b5e77ee3b2c8b3a32e6ef",
    expiration: 1684049390000,
  },
  {
    address: "0x91f13daec00de1706459ac45674bdf0f539b6f0e",
    expiration: 1684049390000,
  },
  {
    address: "0xac2318d4fbfb276b279f03d46942254b941bb345",
    expiration: 1684049390000,
  },
  {
    address: "0xd1a5b91957530e1b3e9cfac1543467c60c352f69",
    expiration: 1684049390000,
  },
  {
    address: "0x484adef8f940c01b79f8603685ccaef84c259b01",
    expiration: 1684049390000,
  },
  {
    address: "0xa3c3dd7fe20b2e03645315ff5b748660a0164fde",
    expiration: 1684049390000,
  },
  {
    address: "0xc9cb494a72a7943ad81dbb9974f14938a33de34c",
    expiration: 1684049390000,
  },
  {
    address: "0x1389754c167d737a6e9a0b15dc5d869195d009bf",
    expiration: 1684049390000,
  },
  {
    address: "0x2aed305759a8bbd0cb7f964115fd7cd15a4925db",
    expiration: 1684049390000,
  },
  {
    address: "0xcaf54f03b9c4df34fc3855ff0bafb4f3fde96c35",
    expiration: 1684049390000,
  },
  {
    address: "0x566c683c859abd0e1ddbec5018330d21acff6e29",
    expiration: 1684049390000,
  },
  {
    address: "0xa755fc7e7a59b1de2ab0fe9c19b38e77fcff9c8d",
    expiration: 1684049390000,
  },
  {
    address: "0xc7ea0a757280717b2b519d4fa17bdba259fa6b2e",
    expiration: 1684049390000,
  },
  {
    address: "0x3ca92d91d27cf725c0fd3c3929e8f5f8c56424eb",
    expiration: 1684049390000,
  },
  {
    address: "0x6196d1d1f1ae38ab835a8ea28713dbc283ee0b5a",
    expiration: 1684049390000,
  },
  {
    address: "0x47842cce1bc77e05ca6c7d8e9cbe60bdc01a5e61",
    expiration: 1684049390000,
  },
  {
    address: "0x74212aacc7bedab7522dcf8d2942f72b30004e19",
    expiration: 1684049390000,
  },
  {
    address: "0xb6b87030bbc50f54c750eea224c96e979bb83d88",
    expiration: 1684049390000,
  },
  {
    address: "0x67cc642f32d724724765dbc40472a3d520b9e02a",
    expiration: 1684049390000,
  },
  {
    address: "0xe5ab837029ac109cc566f09da50c0d1c36257028",
    expiration: 1684049390000,
  },
  {
    address: "0xd0a374d7c70cca5d4ebc0e42fcb6a1ca6c7880e2",
    expiration: 1684049390000,
  },
  {
    address: "0x13b75d28f53a4335a544e05a54ed4b52d19a16ec",
    expiration: 1684049390000,
  },
  {
    address: "0xaa6c368f0dc5df31fcc4f930c3e1fec2a614c716",
    expiration: 1684049390000,
  },
  {
    address: "0x787b9f17fa39239694cb1f07abaa5f7cc8c0e266",
    expiration: 1684049390000,
  },
  {
    address: "0xbc82346a676e16621f8cc7cfa75940becf8b45e2",
    expiration: 1684049390000,
  },
  {
    address: "0xbc15ac912c4af743eed5c0f033824de9de95cd4f",
    expiration: 1684049390000,
  },
  {
    address: "0x7cb557ae9671904f44be5366772a429259077de5",
    expiration: 1684049390000,
  },
  {
    address: "0x4ee37e50f6bd6b3e761ea9ab8d48710c97f2af1f",
    expiration: 1684049390000,
  },
  {
    address: "0x129827c20cdb26b7e6b475c48505a933a857e839",
    expiration: 1684049390000,
  },
  {
    address: "0x6e054b0b80fd06ada55eaaf09c625e7d2833d9a6",
    expiration: 1684049390000,
  },
  {
    address: "0xb9cec555faadc1c689af7c7e3ddbaf54a271ff1f",
    expiration: 1684049390000,
  },
  {
    address: "0x1b4cdd1d9492f6f2bdf158dda65d84808307139d",
    expiration: 1684049390000,
  },
  {
    address: "0xc1c442bb7024455dd10d833dedd8cf7d26e65786",
    expiration: 1684049390000,
  },
  {
    address: "0x9b2726adcf67b20f98e6d34e80370ca25125a845",
    expiration: 1684049390000,
  },
  {
    address: "0xfbb4fe9d1e6b0b8d61dd011350cb761297b52a03",
    expiration: 1684049390000,
  },
  {
    address: "0xd51e4bb31b088f363ea6a15099fb7cdf3bbd6d6c",
    expiration: 1684049390000,
  },
  {
    address: "0xd4c917b3dea8dc03290fc10cfaa553159ccd6645",
    expiration: 1684049390000,
  },
  {
    address: "0x2a0e4ef6c7693ad911ee2d3a289f2707296f633b",
    expiration: 1684049390000,
  },
  {
    address: "0x6222a6d78b79ec96c24a4a6425cf6ebfc6b00f54",
    expiration: 1684049390000,
  },
  {
    address: "0x229d70bc1ca126f854aa9df814af1844495bc77a",
    expiration: 1684049390000,
  },
  {
    address: "0xd06e6d1e14e4e5bff062849749634db9152b4555",
    expiration: 1684049390000,
  },
  {
    address: "0x0957ecbe4983ca4fffec90912218ec3d0d0a6e1e",
    expiration: 1684049390000,
  },
  {
    address: "0xdd8d085ed550a22a0b437e4db3f0a0261d6b7ddd",
    expiration: 1684049390000,
  },
  {
    address: "0xcf481277840aece2690bc31622babf1012706fee",
    expiration: 1684049390000,
  },
  {
    address: "0xff6f17ce1b6856784ce6223d5ec812f571e3b29e",
    expiration: 1684049390000,
  },
  {
    address: "0x1365045aec86356a823e2351d1a136610fb1bf54",
    expiration: 1684049390000,
  },
  {
    address: "0x63f1894550c7fba6ec7e47c24e4be325d75c5a87",
    expiration: 1684049390000,
  },
  {
    address: "0xf367c0e89644e976ff0c96a93a80943bc5228da1",
    expiration: 1684049390000,
  },
  {
    address: "0x576cd0b6a0291608ced7524e17c4241c7cb72f53",
    expiration: 1684049390000,
  },
  {
    address: "0x984b18b1823fef04a4ca7cf1e8a0ef5359fa522f",
    expiration: 1684049390000,
  },
  {
    address: "0x180a64d0f5e6476915461fc50bb177c7b9fef690",
    expiration: 1684049390000,
  },
  {
    address: "0xc4ac4a3dba40934c329af9e7157007bc043422c5",
    expiration: 1684049390000,
  },
  {
    address: "0xbf32dcf7aa6eda1ef8504bc9bade261a143510b9",
    expiration: 1684049390000,
  },
  {
    address: "0x50512168bf0ba7d3799284eef087469e357b5d3c",
    expiration: 1684049390000,
  },
  {
    address: "0xdbfe921dc6a61c3b018c638f37cbcab69958f3d5",
    expiration: 1684049390000,
  },
  {
    address: "0x6a6124d46dbbacea44c36d20301fdacef479045f",
    expiration: 1684049390000,
  },
  {
    address: "0xf7ca043d47ac7b16c69e45b6e4ac79660aeb8407",
    expiration: 1684049390000,
  },
  {
    address: "0x17e5a662b373673475c51b6db9d79bd291dce573",
    expiration: 1684049390000,
  },
  {
    address: "0xfff37b9427c715fd6c6b319586812d8818eda940",
    expiration: 1684049390000,
  },
  {
    address: "0xe74fd9159086c50e4cac2f38aacef897aae6ced6",
    expiration: 1684049390000,
  },
  {
    address: "0xf85d8406acbaca3c3e69b2fefaeeb050c427337b",
    expiration: 1684049390000,
  },
  {
    address: "0x383351e7787347fc7cfe44561c645d6b382e4525",
    expiration: 1684049390000,
  },
  {
    address: "0x4226fe9aafa2aece5037d07f14832e433106cac4",
    expiration: 1684049390000,
  },
  {
    address: "0x13943b9880e8df6cbb275f793f14881c67d5de70",
    expiration: 1684049390000,
  },
  {
    address: "0xc9ad03ea14899f380806114f18496fa664cd0cfa",
    expiration: 1684049390000,
  },
  {
    address: "0x0bf8422f0a124e664f4ac2ec42cfe50afe8b8906",
    expiration: 1684049390000,
  },
  {
    address: "0x8ddf3a1665d913617669a5c51db8d47a722ba4e7",
    expiration: 1684049390000,
  },
  {
    address: "0xfa12ff2b0253e98ad973f827fbb62605f141b086",
    expiration: 1684049390000,
  },
  {
    address: "0x4c9f242f0254be492d8f0a01b814c3bed266f236",
    expiration: 1684049390000,
  },
  {
    address: "0x26f6404d5d5708f7bc227176b53b29723fb8b8a3",
    expiration: 1684049390000,
  },
  {
    address: "0x65bb6f281c8e2c3eb5d0bd39fe119d7610eaacc5",
    expiration: 1684049390000,
  },
  {
    address: "0xbfddab9c90ac0211814330f2e22bb0a228825805",
    expiration: 1684049390000,
  },
  {
    address: "0xeae59890f7787b05d0c6375651cd59920afb0576",
    expiration: 1684049390000,
  },
  {
    address: "0xbe5838b07eed79870f39e35e87db655119ea7346",
    expiration: 1684049390000,
  },
  {
    address: "0x610cc186770ee88675b1728c37689f344e4a4b09",
    expiration: 1684049390000,
  },
  {
    address: "0x13dbacc247a3a0d980dcd29ac137fc79765489ff",
    expiration: 1684049390000,
  },
  {
    address: "0x2112fb29fb6d031c79c8e0726cc90f68cd7dc8fa",
    expiration: 1684049390000,
  },
  {
    address: "0xbdc930217dceee7193cd908892f0cd1617077233",
    expiration: 1684049390000,
  },
  {
    address: "0xc34ae1a39662415a4720d4a3e7c2be0e202568c2",
    expiration: 1684049390000,
  },
  {
    address: "0x590bbfd4c71b310ad670d0a72ac290c660a78e35",
    expiration: 1684049390000,
  },
  {
    address: "0xe96eb88bc7db7fd233da23174e9eb19067c52194",
    expiration: 1684049390000,
  },
  {
    address: "0xfcca6795934528041f9f8d09883b2f2fb6806b65",
    expiration: 1684049390000,
  },
  {
    address: "0x0f31510a27a6a1da4dc3f70edb83bdb180e4a459",
    expiration: 1684049390000,
  },
  {
    address: "0xd8becb40ef1209027e49b98888fc8387f049204c",
    expiration: 1684049390000,
  },
  {
    address: "0x965f2225bc4657ad9e1a892e6299db312f2d5588",
    expiration: 1684049390000,
  },
  {
    address: "0x40dd93562b869c1f89a13113289c8bba171ba955",
    expiration: 1684049390000,
  },
  {
    address: "0x49e53fb3d5bf1532febad88a1979e33a94844d1d",
    expiration: 1684049390000,
  },
  {
    address: "0x62d672e7966c24fc57fbc0f2acb99601899a50dc",
    expiration: 1684049390000,
  },
  {
    address: "0x4c55849d3f413194d9644a3d3001360f287f5db4",
    expiration: 1684049390000,
  },
  {
    address: "0xf70471f27e943b8d802be81980f177fa5725ae9d",
    expiration: 1684049390000,
  },
  {
    address: "0x0311663d459db2314b6f8f2859e535ff6da56eed",
    expiration: 1684049390000,
  },
  {
    address: "0x7afb3f0ef8c998d8dfe114a00bb9411d00e52543",
    expiration: 1684049390000,
  },
  {
    address: "0x38012eaf414bfe674d6dd071d854e0bca4e39b1c",
    expiration: 1684049390000,
  },
  {
    address: "0x89d53e8612e8416bf960dc9444ce0e2a0878a582",
    expiration: 1684049390000,
  },
  {
    address: "0x207a39a7ec26aac9edf13748a5c653e325560bf9",
    expiration: 1684049390000,
  },
  {
    address: "0xe8c0275bfa1f1a16a6777c6a3251b6873a25cad8",
    expiration: 1684049390000,
  },
  {
    address: "0x8c18593b91782047c64761456fe53b23d5034191",
    expiration: 1684049390000,
  },
  {
    address: "0x428ba87cc89d457ea0754b7fa8bf39cfb53ed63a",
    expiration: 1684049390000,
  },
  {
    address: "0x69820aa9765deb1079f9edd1d1059589de4282a0",
    expiration: 1684049390000,
  },
  {
    address: "0xfecf0de7e697298099083e5e50e91731b4fa1ac3",
    expiration: 1684049390000,
  },
];

const isTeam = address => teamAddresses.find(a => a?.toLowerCase() === address?.toLowerCase())?.length > 0;

module.exports = { allowedAddresses, teamAddresses, isTeam };
