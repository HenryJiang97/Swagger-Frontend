import { Component } from "react";
import Axios from 'axios';
import yaml from 'js-yaml';
import fileDownload from 'js-file-download';
import {
    apiPrefix
} from './Config';
import { Link } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versionSelection: 2,
            selectedFile: null,
            fileNameList: [],
        }
        this.handleVersionChange = this.handleVersionChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
        this.handleFileLinkClick = this.handleFileLinkClick.bind(this);
        this.handleDropButtonClicked = this.handleDropButtonClicked.bind(this);
    }

    componentDidMount() {
        this.getFileList();
    }

    handleVersionChange(evt) {
        this.setState(
            {
                versionSelection: evt.target.value === 'v2' ? 2 : 3,
            }
        )
    }

    handleFileChange(evt) {
        this.setState({ selectedFile: evt.target.files[0] });// Get file data

        // Get file data
        const data = new FormData();
        data.append('file', evt.target.files[0]);

        Axios
        .post(`${apiPrefix}/details`, data)
        .then(function (response) {
            alert(response);
        })
        .catch(function (err) {
            alert(err);
        });
    }

    // Get file name list from the database
    getFileList() {
        let that = this;
        Axios
        .get(`${apiPrefix}/list`)
        .then(function (response) {
            let fileNameList = response.data['names'];
            console.log(fileNameList);
            that.setState({fileNameList: fileNameList});
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    handleUploadButtonClick() {
        const that = this;

        // Get file data
        const data = new FormData();
        data.append('file', this.state.selectedFile);

        Axios
        .post(`${apiPrefix}/upload/${that.state.versionSelection}`, data)
        .then(function (response) {
            console.log(response.data['response']);
            alert(response.data['response']);
        })
        .then(function() {
            that.getFileList();
        })
        .catch(function (err) {
            alert(err);
        });
    }

    handleFileLinkClick(fileName) {
        Axios
        .get(`${apiPrefix}/download/${fileName}`)
        .then(function (response) {
            const obj = response.data['file'][0][0];
            let yamlStr = yaml.safeDump(obj);
            fileDownload(yamlStr, fileName);            
        })
        .catch(function (err) {
            alert(err);
        })
    }

    handleDropButtonClicked() {
        const that = this;

        Axios
        .delete(`${apiPrefix}/drop`)
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

    // File info
    fileData() {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h4>File Details:</h4>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    // API file details
    apiDetails() {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h5>Models:</h5>
                    
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h5>Empty</h5>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h2>Swagger API Service</h2>

                {/* Upload */}
                <div>
                    <h3>Upload</h3>
                    <div>
                        <p>API version: </p>
                        <form>
                            <label>
                                <input 
                                    type="radio" 
                                    value="v2" 
                                    checked={this.state.versionSelection === 2}
                                    onChange={this.handleVersionChange}    
                                />
                                v2
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="v3" 
                                    checked={this.state.versionSelection === 3} 
                                    onChange={this.handleVersionChange}
                                />
                                v3
                            </label>
                        </form>
                    </div>
                    
                    <input type="file" name="api" onChange={this.handleFileChange} />
                    <button onClick={this.handleUploadButtonClick}>
                        Upload
                    </button>
                </div>

                <br />
                <br />
                
                {/* Details */}
                <div>
                    <h3>Details</h3>
                    <div>
                        {this.apiDetails()}
                    </div>
                </div>

                <br />
                <br />
                
                {/* Download */}
                <div>
                    <h3>Download</h3>
                    <div>
                        <h4>Download .yaml files</h4>
                        <div>
                            {this.state.fileNameList.map((fileName) => 
                                <div key={fileName}>
                                    <Link 
                                        key={fileName} 
                                        onClick={() => this.handleFileLinkClick(fileName)}
                                    >
                                        {fileName}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button onClick={this.handleDropButtonClicked}>Drop Table</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;