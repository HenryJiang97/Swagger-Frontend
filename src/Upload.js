import { Component } from "react";
import Axios from 'axios';
import yaml from 'js-yaml';
import {
    apiPrefix
} from './Config';

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
        let fileReader = new FileReader();
        fileReader.onloadend = async(e) => {
            const content = fileReader.result;
            const details = yaml.safeLoad(content);
            this.setState(
                {fileObj: details},
                () => {
                    console.log(details);
                    this.parseFileDetails(details);
                }
            );
        };
        fileReader.readAsBinaryString(this.state.selectedFile);
    }

    // Parse file details
    parseFileDetails(details) {
        // Get api version
        let apiVersion = parseInt(details['swagger'] !== undefined ? details['swagger'] : details['openapi']);
        console.log(`API version: ${apiVersion}`);

        // Get info
        let info = details['info'];
        console.log(`Info: ${info}`);

        // Get paths
        let paths = details['paths'];
        console.log(`Paths: ${paths}`);

        // Get definitions
        let definitions = apiVersion === 2 ? details['definitions'] : details['components']['schemas'];
        console.log(`Definitions: ${definitions}`);

        this.setState({
            fileDetails: {
                apiVersion: apiVersion,
                info: info,
                paths: paths,
                definitions: definitions,
            }
        })
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

    render() {
        return (
            <div>
                <br />

                <div>
                    <label>Choose API file to upload:</label>
                    <input type="file" name="api" accept=".yaml" onChange={this.handleFileChange} />
                </div>

                <br />

                <div>
                    <button onClick={this.handleUploadButtonClick}>Upload</button>
                </div>
            </div>
        )
    }
}

export default Upload;