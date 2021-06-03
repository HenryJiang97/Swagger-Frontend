import { Component } from "react";
import Axios from 'axios';
import yaml from 'js-yaml';
import fileDownload from 'js-file-download';
import Table from 'react-bootstrap/Table'
import {
    apiPrefix
} from './Config';
import { Link } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
        }
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleClearButtonClicked = this.handleClearButtonClicked.bind(this);
    }

    componentDidMount() {
        this.getFileList();
    }

    // Get file list from the database
    getFileList() {
        let that = this;
        Axios
        .get(`${apiPrefix}/list`)
        .then(function (response) {
            let fileList = response.data['response'];
            // console.log(fileList);
            that.setState({fileList: fileList});
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    // Download file
    handleDownloadClick(fileName) {
        Axios
        .get(`${apiPrefix}/download/${fileName}`)
        .then(function (response) {
            const obj = response.data['file'][0][0];
            // console.log(obj);
            let yamlStr = yaml.safeDump(obj);
            fileDownload(yamlStr, fileName);
        })
        .catch(function (err) {
            alert(err);
        })
    }

    handleClearButtonClicked() {
        const that = this;

        Axios
        .delete(`${apiPrefix}/clear`)
        .then(function (response) {
            alert(response.data['response']);
        })
        .then(function() {
            that.getFileList();
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <br />
                <h3>Files</h3>
                <br />

                {/* Table View */}
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>API Version</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.fileList.map((file) => 
                                <tr key={file['name']}>
                                    <td>{file['title']}</td>
                                    <td>{file['apiVersion']}</td>
                                    <Link 
                                        key={file['name']} 
                                        onClick={() => this.handleDownloadClick(file['name'])}
                                    >
                                        download
                                    </Link>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                <div>
                    <button onClick={this.handleClearButtonClicked}>Clear Table</button>
                </div>
            </div>
        );
    }
}

export default Home;