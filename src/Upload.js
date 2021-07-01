import { Component } from "react";
import Axios from 'axios';
import './Upload.css';
import {
    apiPrefix
} from './Config';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
        }
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleRawUploadButtonClick = this.handleRawUploadButtonClick.bind(this);
        this.handleJsonUploadButtonClick = this.handleJsonUploadButtonClick.bind(this);
    }

    handleFileChange(evt) {
        this.setState(
            { selectedFile: evt.target.files[0] },
        );// Get file data
    }

    handleRawUploadButtonClick() {
        var bodyFormData = new FormData();
        bodyFormData.append('raw', this.state.selectedFile);

        Axios({
            method: "post",
            url: `${apiPrefix}/swaggerspec`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
            alert("Uploaded");
        })
        .catch(function (err) {
            alert(err);
        });
    }

    handleJsonUploadButtonClick() {
        var bodyFormData = new FormData();
        bodyFormData.append('JSON', this.state.selectedFile);

        Axios({
            method: "post",
            url: `${apiPrefix}/swaggerspec`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
            alert("Uploaded");
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
                    <input id="file" type="file" name="api" accept=".yaml, .json" onChange={this.handleFileChange} />
                </div>

                <br />

                <div>
                    <button onClick={this.handleRawUploadButtonClick}>Upload Raw file</button>
                    <button onClick={this.handleJsonUploadButtonClick}>Upload Base64 JSON</button>
                </div>
            </div>
        )
    }
}

export default Upload;