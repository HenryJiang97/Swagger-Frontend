import { Component } from "react";
import Axios from 'axios';
import yaml from 'js-yaml';
import {
    apiPrefix
} from './Config';
import { Col, Form } from "react-bootstrap";

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            fileObj: null,
            fileDetails: null,
        }
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    }

    handleFileChange(evt) {
        this.setState(
            { selectedFile: evt.target.files[0]},
            () => this.getFileDetails()
        );// Get file data
    }

    // Get file details
    getFileDetails() {
        const that = this;
        let fileReader = new FileReader();

        fileReader.onloadend = async(e) => {
            try {
                const details = yaml.safeLoad(fileReader.result);

                // Validate API file
                Axios
                .post(
                    `${apiPrefix}/validate`, 
                    {
                        "apiVersion": parseInt(details['swagger'] !== undefined ? details['swagger'] : details['openapi']),
                        "file": details,
                    }
                )
                .then(function (response) {
                    let valid = response.data['response']

                    if (!valid) {
                        alert("Invalid File");
                        that.setState({selectedFile: null});
                        document.getElementById("file").value = "";
                    } else {
                        that.setState(
                            {fileObj: details},
                            () => {
                                that.parseFileDetails(details);
                            }
                        );
                    }
                })
            } catch (error) {
                alert("Invalid File");
                that.setState({selectedFile: null});
                document.getElementById("file").value = "";
            }
        };
        fileReader.readAsBinaryString(this.state.selectedFile);
    }

    // Parse file details
    parseFileDetails(details) {
        // Get api version
        let apiVersion = parseInt(details['swagger'] !== undefined ? details['swagger'] : details['openapi']);
        // console.log(`API version: ${apiVersion}`);

        // Get info
        let info = details['info'];
        // console.log(`Info: ${info}`);

        // Get paths
        let paths = details['paths'];
        // console.log(`Paths: ${paths}`);

        // Get definitions
        let definitions = apiVersion === 2 ? details['definitions'] : details['components']['schemas'];
        // console.log(`Definitions: ${definitions}`);

        this.setState( 
            {
                fileDetails: {
                    apiVersion: apiVersion,
                    info: info,
                    paths: paths,
                    definitions: definitions,
                }
            },
            () => console.log(this.state.fileDetails)
        );
    }

    handleUploadButtonClick() {
        const data = {
            "name": this.state.selectedFile.name,
            "title": this.state.fileDetails.info['title'],
            "version": this.state.fileDetails.apiVersion,
            "file": this.state.fileObj,
        };

        Axios
        .post(`${apiPrefix}/upload`, data)
        .then(function (response) {
            alert(response.data['response']);
        })
        .catch(function (err) {
            alert(err);
        });
    }

    // File Data
    fileData() {
        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={1}>
                                <b>Basic Info</b>
                            </Form.Label>
                        </Form.Group>

                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={2}>
                                Title
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control 
                                    value={this.state.fileDetails === null || this.state.fileDetails['info']['title'] === undefined ? "" : this.state.fileDetails['info']['title']}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={2}>
                                Description
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control 
                                    value={this.state.fileDetails === null || this.state.fileDetails['info']['description'] === undefined ? "" : this.state.fileDetails['info']['description']}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={2}>
                                Version
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control 
                                    value={this.state.fileDetails === null || this.state.fileDetails['info']['version'] === undefined ? "" : this.state.fileDetails['info']['version']}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={2}>
                                API Version
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control 
                                    value={this.state.fileDetails === null || this.state.fileDetails['apiVersion'] === undefined ? "" : this.state.fileDetails['apiVersion']}
                                />
                            </Col>
                        </Form.Group>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={1}>
                                <b>Paths</b>
                            </Form.Label>
                        </Form.Group>

                        {
                            this.state.fileDetails === null || this.state.fileDetails['paths'] === undefined
                            ?
                            <Form.Group as={Form.Row}>
                                <Form.Label column sm={2}>
                                    Nothing
                                </Form.Label>
                            </Form.Group>
                            :
                            Object
                            .keys(this.state.fileDetails['paths'])
                            .map(function(title, value) {
                                return (
                                    <Form.Group as={Form.Row}>
                                        <Form.Label column sm={2}>
                                            {title}
                                        </Form.Label>

                                        <Form.Label column sm={2}>
                                            {value}
                                        </Form.Label>
                                        
                                        {/* {
                                            Object
                                            .keys(value)
                                            .map(function(method, value) {
                                                return (
                                                    <Form.Group as={Form.Row}>
                                                        <Form.Label column sm={3}>
                                                            {method}
                                                        </Form.Label>
                                                    </Form.Group>
                                                );
                                            })
                                        } */}
                                    </Form.Group>
                                );
                            })
                        }
                    </Form.Group>
                </Form>
            </div>
        );
    };

    render() {
        return (
            <div>
                <br />

                <div>
                    <label>Choose API file to upload:</label>
                    <input id="file" type="file" name="api" accept=".yaml" onChange={this.handleFileChange} />
                </div>

                <br />

                <div>
                    <button onClick={this.handleUploadButtonClick}>Upload</button>
                </div>

                <br />
                <br />

                {/* Details */}
                {this.fileData()}
            </div>
        )
    }
}

export default Upload;