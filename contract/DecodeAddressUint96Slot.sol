// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract DecodeAddressUint96Slot { 

    //Values to encode
    uint public tempRequestAddress = 1102552892404058133515520251406936644975802420559;
    uint public tempTwitter_id = 1438606749389541377;          //12 BYTES, 32/32 FOR SLOT 0

    //mix = 2102526119708102644685250484424962510481439752012496174033982717952
    uint public mix = (tempTwitter_id<<160) + tempRequestAddress;

    //Decode
    uint public decodeTwitterID = (mix>>160);
    uint public decodeAddressID = tempRequestAddress & 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

}
