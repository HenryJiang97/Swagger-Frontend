import { Component } from "react";
import Axios from 'axios';
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
        .get(`${apiPrefix}/swaggerspec`)
        .then(function (response) {
            let fileList = response.data;
            // console.log(fileList);
            that.setState({fileList: fileList});
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    // Download file
    handleDownloadClick(id, filename) {
        Axios
        .get(`${apiPrefix}/swaggerspec/${id}`)
        .then(function (response) {
            fileDownload(response.data, filename)
        })
        .catch(function (err) {
            alert(err);
        })
    }

    handleClearButtonClicked() {
        const that = this;

        Axios
        .delete(`${apiPrefix}/swaggerspec`)
        .then(function (response) {
            alert("Cleared");
        })
        .then(function() {
            that.getFileList();
        })
        .catch(function (err) {
            alert(err);
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
                                <th>ID</th>
                                <th>Name</th>
                                <th>Version</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.fileList.map((file) => 
                                <tr key={file['id']}>
                                    <td>{file['id']}</td>
                                    <td>{file['name']}</td>
                                    <td>{file['version']}</td>
                                    <td>
                                        <Link
                                            key="details" 
                                            to={{
                                                pathname: '/details',
                                                query: {
                                                    id: file['id'],
                                                },
                                            }}
                                        >
                                            Details
                                        </Link>
                                        <Link 
                                            key="download"
                                            onClick={() => this.handleDownloadClick(file['id'], file['name'])}
                                            to={{}}
                                        >
                                            Download
                                        </Link>
                                    </td>
                                    
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