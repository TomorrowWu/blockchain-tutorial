import web3 from './web3';
import Project from '../compiled/Project.json';

//函数：根据Project合约地址，得到Project实例
const getContract = address => new web3.eth.Contract(JSON.parse(Project.interface), address);

export default getContract;
