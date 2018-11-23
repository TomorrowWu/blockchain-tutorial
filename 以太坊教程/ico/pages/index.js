import React from 'react';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
// import Web3 from 'web3';
import web3 from '../libs/web3'

class Index extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			accounts: []
		};
		
		//Metamask 会在浏览器的 Javascript 中注入全局的 Provider，提供给Web3对象使用，
		// 所以在安装了 Metamask 的情况下，我们在浏览器环境下可以直接这样初始化 Web3 实例
		// this.web3 = new Web3(window.web3.currentProvider);
	}
	
	async componentDidMount() {
		
		const accounts = await web3.eth.getAccounts();
		//将多个Promise实例包装成一个新的Promise实例,成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值
		const balances = await Promise.all(accounts.map(x => web3.eth.getBalance(x)));
		
		// console.log(accounts);
		// this.setState({accounts});
		console.log(accounts, balances);
		this.setState({
			accounts: accounts.map((x, i) => ({
				account: x,
				balance: balances[i]
			}))
		});
	}
	
	render() {
		const {accounts} = this.state;
		return (
			<Layout>
				<ul>{accounts.map(x => (
					<li key={x.account}>
						{x.account} => {web3.utils.fromWei(x.balance, 'ether')}
					</li>
				))}
				</ul>
            </Layout>
		)
	}
}


export default withRoot(Index);
