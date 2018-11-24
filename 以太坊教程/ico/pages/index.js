import React from 'react';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
import web3 from '../libs/web3';
import {Button, Card, CardActions, CardContent, Grid, LinearProgress, Typography} from '@material-ui/core';
import {Link} from '../routes';
import ProjectList from '../libs/projectList';
import Project from '../libs/project';
import InfoBlock from '../components/InfoBlock';

class Index extends React.Component {
	
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		accounts: []
	// 	};
		
		//Metamask 会在浏览器的 Javascript 中注入全局的 Provider，提供给Web3对象使用，
		// 所以在安装了 Metamask 的情况下，我们在浏览器环境下可以直接这样初始化 Web3 实例
		// this.web3 = new Web3(window.web3.currentProvider);
	// }
	
	// async componentDidMount() {
	//
	// 	const accounts = await web3.eth.getAccounts();
	// 	//将多个Promise实例包装成一个新的Promise实例,成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值
	// 	const balances = await Promise.all(accounts.map(x => web3.eth.getBalance(x)));
	//
	// 	// console.log(accounts);
	// 	// this.setState({accounts});
	// 	console.log(accounts, balances);
	// 	this.setState({
	// 		accounts: accounts.map((x, i) => ({
	// 			account: x,
	// 			balance: balances[i]
	// 		}))
	// 	});
	// }
	
	static async getInitialProps({req}) {
		const addressList = await ProjectList.methods.getProjects().call();
		//getSummary 接口返回的数据格式是一个数组
		const summaryList = await Promise.all(addressList.map(address => Project(address).methods.getSummary().call()));
		console.log({summaryList});
		
		const projects = addressList.map((address, i) => {
			//解构赋值
			const [description, minInvest, maxInvest, goal, balance, investorCount, paymentCount, owner] = Object.values(summaryList[i]);
			return {
				address,
				description,
				minInvest,
				maxInvest,
				goal,
				balance,
				investorCount,
				paymentCount,
				owner
			}
		});
		console.log(projects);
		
		return {projects};
	}
	
	render() {
		// const {accounts} = this.state;
		const {projects} = this.props;
		
		return (
			<Layout>
				{/*<ul>{accounts.map(x => (*/}
				{/*<li key={x.account}>*/}
				{/*{x.account} => {web3.utils.fromWei(x.balance, 'ether')}*/}
				{/*</li>*/}
				{/*))}*/}
				{/*</ul>*/}
				<Grid container spacing={16}>
					{projects.map(this.renderProject)}
				</Grid>
            </Layout>
		)
	}
	
	renderProject(project) {
		const progress = project.balance / project.goal * 100;
		return (
			<Grid item md={6} key={project.address}>
				<Card>
					<CardContent>
						<Typography gutterBottom variant="headline" component="h2">{project.description}</Typography>
						<LinearProgress style={{margin: '10px 0'}} color="primary" variant="determinate"
						                value={progress}/>
					</CardContent>
					<Grid container spacing={16}>
						<InfoBlock title={`${web3.utils.fromWei(project.goal, 'ether')} ETH`} description="募资上限"/>
						<InfoBlock title={`${web3.utils.fromWei(project.minInvest, 'ether')} ETH`}
						           description="最小投资金额"/>
						<InfoBlock title={`${web3.utils.fromWei(project.maxInvest, 'ether')} ETH`}
						           description="最大投资金额"/>
						<InfoBlock title={`${project.investorCount}人`} description="参投人数"/>
						<InfoBlock title={`${web3.utils.fromWei(project.balance, 'ether')} ETH`} description="已募资金额"/>
					</Grid>
					<CardActions>
						<Link route={`/projects/${project.address}`}>
							<Button size="small" color="primary">
								立即投资
							</Button>
						</Link>
						<Link route={`/projects/${project.address}`}>
							<Button size="small" color="secondary">
								查看详情
							</Button>
						</Link>
					</CardActions>
				</Card>
			</Grid>
		);
	}
}


export default withRoot(Index);
