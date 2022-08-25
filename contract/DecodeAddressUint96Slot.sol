// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract DecodeAddressUint96Slot { 

    //Values to encode
    //Uint address: 1102552892404058133515520251406936644975802420559
    uint public tempRequestAddress = uint(uint160(0xc1202e7d42655F23097476f6D48006fE56d38d4f));
    //Shifted: 2102526119708102644685250484424962510481439752012496174033982717952
    uint public tempTwitter_id = 1438606749389541377;          
    uint public shiftedTempTwitter_id = tempTwitter_id<<160;          


    //Mix:     2102526119708102645787803376829020643996960003419432819009785138511
    uint public mix = shiftedTempTwitter_id + tempRequestAddress;

    //Decode
    uint public decodeTwitterID = (mix>>160);
    address public decodeAddressID = address(uint160(mix & 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF));

}
