const BigNumber = web3.BigNumber;
BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: BigNumber.ROUND_DOWN });

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

/**
 *  Check the batch of accounts for their balances
 *
 * @param token - token contract
 * @param acc - accounts list to check
 * @param amounts - expected balances of accounts
 */
async function checkBalances(token, acc, amounts) {
  for (let i = 0; i < acc.length; i += 1) {
    let balance = await token.balanceOf(acc[i]);
    balance.should.be.bignumber.equal(amounts[i], `Wallet ${i} balance is wrong`);
  }
}

/*
Checking opportunity to send tokens to token wallets
@token - token contract instance
@donor - who is the donor of first funds
@senders - senders wallets
@recipients - recipients wallets
 */
async function prepareTransfer(token, senders, recipients, amounts) {

  senders.forEach(async (sender, i) => {
    // Read initial balances
    const initialSenderBalance = web3.toBigNumber(await token.balanceOf(senders[i]));
    const initialRecipientBalance = web3.toBigNumber(await token.balanceOf(recipients[i]));

    // Transfer
    await token.transfer(recipients[i], amounts[i], {from: senders[i]});

    // Read final balances and calculate diffs
    const finalSenderBalance = new BigNumber(await token.balanceOf(senders[i]));
    const finalRecipientBalance = new BigNumber(await token.balanceOf(recipients[i]));
    const senderDiff = initialSenderBalance.sub(finalSenderBalance);
    const recipientsDiff = finalRecipientBalance.sub(initialRecipientBalance);

    // Verify diffs
    senderDiff.should.be.bignumber.equal(amounts[i], 'Wallet' +  i + ' balance decreased by transfer value');
    recipientsDiff.should.be.bignumber.equal(amounts[i], 'Wallet' +  i + ' balance decreased by transfer value');
  });

}

/*
 ERC20 transfer test
 @token - token contract instance
 @sender - sender of tokens
 #recipient - recipient of tokens
*/
async function ERC20Transfer(token, sender, recipient) {
// Set watcher to Transfer event that we are looking for
  const watcher = token.Transfer();
  const transfer1 = {
    to: recipient,
    value: 1
  };

  await token.transfer(...Object.values(transfer1), {from: sender});
  const output = watcher.get();

  const eventArguments = output[0].args;
  const argCount = Object.keys(eventArguments).length;
  const arg1Name = Object.keys(eventArguments)[0];
  const arg1Value = eventArguments[arg1Name];
  const arg2Name = Object.keys(eventArguments)[1];
  const arg2Value = eventArguments[arg2Name];
  const arg3Name = Object.keys(eventArguments)[2];
  const arg3Value = eventArguments[arg3Name];

  argCount.should.be.equal(3, 'Transfer event number of arguments');
  arg1Name.should.be.equal('from', 'Transfer event first argument name');
  arg1Value.should.be.equal(sender, 'Transfer event from address');
  arg2Name.should.be.equal('to', 'Transfer event second argument name');
  arg2Value.should.be.equal(recipient, 'Transfer event to address');
  arg3Name.should.be.equal('tokens', 'Transfer event third argument name');
  arg3Value.should.be.bignumber.equal(transfer1.value, 'Transfer event value');
}

/*
 ERC20 transferFrom test
 @token - token contract instance
 @sender - who approved to send
 @owner - owner of approved tokens
 #recipient - recipient of tokens
*/
async function ERC20AllocateTransferFrom(token, sender, owner, recipient) {
// Set watcher to Transfer event that we are looking for
  const watcher = token.Transfer();
  const approvalWatcher = token.Approval();

  // Approve parameters
  const approve = {
    spender: sender,
    value: 100
  };

  // TransferFrom parameters
  const transfer = {
    from: owner,
    to: recipient,
    value: 100
  };

  await token.approve(...Object.values(approve), {from: owner});
  const approvalOutput = approvalWatcher.get();

  // Verify number of Approval event arguments, their names, and content
  let eventArguments = approvalOutput[0].args;
  const arg0Count = Object.keys(eventArguments).length;
  const arg01Name = Object.keys(eventArguments)[0];
  const arg01Value = eventArguments[arg01Name];
  const arg02Name = Object.keys(eventArguments)[1];
  const arg02Value = eventArguments[arg02Name];
  const arg03Name = Object.keys(eventArguments)[2];
  const arg03Value = eventArguments[arg03Name];

  arg0Count.should.be.equal(3, 'Approval event number of arguments');
  arg01Name.should.be.equal('tokenOwner', 'Transfer event first argument name');
  arg01Value.should.be.equal(owner, 'Transfer event from address');
  arg02Name.should.be.equal('spender', 'Transfer event second argument name');
  arg02Value.should.be.equal(sender, 'Transfer event to address');
  arg03Name.should.be.equal('tokens', 'Transfer event third argument name');
  arg03Value.should.be.bignumber.equal(transfer.value, 'Transfer event value');


  await token.transferFrom(...Object.values(transfer), {from: sender});
  const output = watcher.get();

  // Verify number of Transfer event arguments, their names, and content
  eventArguments = output[0].args;
  const argCount = Object.keys(eventArguments).length;
  const arg1Name = Object.keys(eventArguments)[0];
  const arg1Value = eventArguments[arg1Name];
  const arg2Name = Object.keys(eventArguments)[1];
  const arg2Value = eventArguments[arg2Name];
  const arg3Name = Object.keys(eventArguments)[2];
  const arg3Value = eventArguments[arg3Name];

  argCount.should.be.equal(3, 'Transfer event number of arguments');
  arg1Name.should.be.equal('from', 'Transfer event first argument name');
  arg1Value.should.be.equal(owner, 'Transfer event from address');
  arg2Name.should.be.equal('to', 'Transfer event second argument name');
  arg2Value.should.be.equal(recipient, 'Transfer event to address');
  arg3Name.should.be.equal('tokens', 'Transfer event third argument name');
  arg3Value.should.be.bignumber.equal(transfer.value, 'Transfer event value');
}

/*
 ERC20 totalSupply test
 @token - contract instance
 @totalS - totalSupply of tokens
*/
async function ERC20TotalSupply(token, totalS) {
  var totalSupply = new BigNumber(await token.totalSupply());
  totalSupply.should.be.bignumber.equal(totalS, 'Token total supply');
}

/*
 ERC20 balanceOf test
 @token - contract instance
 @walletAddress - wallet to check balance
*/
async function ERC20BalanceOf(token, walletAddress) {
  await token.balanceOf(walletAddress).should.be.fulfilled;
}

/*
 ERC20 Allowance test
 @token - token contract instance
 @address1 - who allows
 @address2 - allowed
*/
async function ERC20Allowonce(token, address1, address2) {
  await token.allowance(address1, address2).should.be.fulfilled;
}



contract('UNCToken', function (accounts) {
  const UNCToken = artifacts.require('./../contracts/UNCToken.sol');
  let token;

  /* accounts */
  let TeamAddress = accounts[1]; // Unicom Wallets
  let BountyAddress = accounts[2];
  let AdvisersAddress = accounts[3];
  let FoundingAddress = accounts[4];
  let InvestorsAddress = accounts[5];
  let userAddress1 = accounts[10]; // Customer wallets
  let userAddress2 = accounts[11];
  let userAddress3 = accounts[12];
  let userAddress4 = accounts[13];
  let userAddress5 = accounts[14];
  let userAddress6 = accounts[15];
  let userAddress7 = accounts[16];

  let tokenSymbol = "UNC";
  let totalSupply = 100e24;

  describe('UNCToken tests', async () => {
    beforeEach(async function () {
      token = await UNCToken.new();
    });


    describe('Common token tests', async() => {
      it('Should put 0 in the first account', async () => {
        await checkBalances(token, [accounts[0]], [0.0]);
      });

      it('Token symbol', async () => {
        var actualTokenSymbol = await token.symbol();
        actualTokenSymbol.should.be.equal(tokenSymbol);
      });

      //#### Mint tokens.
      it('Should put correct amounts in all wallets', async () => {
        const accounts = [
          TeamAddress,
          BountyAddress,
          AdvisersAddress,
          FoundingAddress,
          InvestorsAddress,
          userAddress1,
          userAddress2,
        ];
        const amounts = [5e24, 6e24, 5e24, 24e24, 60e24, 0, 0];
        await checkBalances(token, accounts, amounts);
      });

      //#### Setting stage periods.
      it('Transfer tokens from all preset wallets should be allowed', async () => {
        const senders = [
            TeamAddress,
            BountyAddress,
            AdvisersAddress,
            FoundingAddress,
            InvestorsAddress
        ];
        const recipients = [
            userAddress1, userAddress1, userAddress2, userAddress3, userAddress4
        ];
        const amounts = [];
        for (let i = 0; i < senders.length; i += 1) {
          amounts.push((i+1)*1000);
        }
        await prepareTransfer(token, senders, recipients, amounts);
      });

      it('ERC20 Comliance Tests - Transfer generates correct Transfer event', async () => {
        await ERC20Transfer(token, InvestorsAddress, accounts[10])
      });

      it('ERC20 Comliance Tests - Allocate + TransferFrom generates correct Approval and Transfer event', async () => {
        await ERC20AllocateTransferFrom(token, InvestorsAddress, BountyAddress, accounts[10])
      });

      it('ERC20 Comliance Tests - totalSupply', async () => {
        await ERC20TotalSupply(token, totalSupply);
      });

      it('ERC20 Comliance Tests - balanceOf', async () => {
        await ERC20BalanceOf(token, accounts[0]);
      });

      it('ERC20 Comliance Tests - allowance', async () => {
        await ERC20Allowonce(token, accounts[1], accounts[0]);
      });

    })

  });
});
