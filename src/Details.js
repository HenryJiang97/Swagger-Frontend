import Axios from "axios";
import { Component } from "react";
import {
    apiPrefix
} from './Config';
import { apiData } from "./services/ApiData";
import {
    parseFile
} from './services/ParseFile';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: this.props.location.query.fileName,
            fileDetails: null,
        }
    }

    componentDidMount() {
        this.getFileDetais();
    }

    getFileDetais() {
        const that = this;
        Axios
        .get(`${apiPrefix}/download/${this.state.fileName}`)
        .then(function (response) {
            const obj = response.data['file'][0][0];
            let fileDetails = parseFile(obj);
            that.setState({
                fileDetails: fileDetails,
            });
        })
        .catch(function (err) {
            alert(err);
        })
    }

    render() {
        return (
            <div>
                {apiData(this.state)}
            </div>
        );
    };
}