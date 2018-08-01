pragma solidity 0.4.24;

contract WalletParameters {
    ///////////////////////////////////////////////////////////////////////////
    // Configuration Independent Parameters
    ///////////////////////////////////////////////////////////////////////////

    struct AddressTokenAllocation {
        address addr;
        uint256 amount;
    }

    ///////////////////////////////////////////////////////////////////////////
    // Production Config
    ///////////////////////////////////////////////////////////////////////////

    //AddressTokenAllocation internal TeamWallet      = AddressTokenAllocation(,  5e6);
    //AddressTokenAllocation internal BountyWallet    = AddressTokenAllocation(,  6e6);
    //AddressTokenAllocation internal AdvisersWallet  = AddressTokenAllocation(,  5e6);
    //AddressTokenAllocation internal FoundingWallet  = AddressTokenAllocation(, 24e6);
    //AddressTokenAllocation internal InvestorsWallet = AddressTokenAllocation(, 60e6);

    ///////////////////////////////////////////////////////////////////////////
    // QA Config
    ///////////////////////////////////////////////////////////////////////////

    AddressTokenAllocation internal TeamWallet      = AddressTokenAllocation(0x8d6d63c22D114C18C2a0dA6Db0A8972Ed9C40343,  5e6);
    AddressTokenAllocation internal BountyWallet    = AddressTokenAllocation(0x9567397B445998E7E405D5Fc3d239391bf5d0200,  6e6);
    AddressTokenAllocation internal AdvisersWallet  = AddressTokenAllocation(0x5d2fca837fdFDDCb034555D8E79CA76A54038e16,  5e6);
    AddressTokenAllocation internal FoundingWallet  = AddressTokenAllocation(0xd3b6B8528841C1c9a63FFA38D96785C32E004fA5, 24e6);
    AddressTokenAllocation internal InvestorsWallet = AddressTokenAllocation(0xa83202b9346d9Fa846f1B0b3BB0AaDAbEa88908E, 60e6);
}
