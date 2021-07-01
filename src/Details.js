import Axios from "axios";
import { Component } from "react";
import {
    apiPrefix
} from './Config';
import { Info } from "./models/info";

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.query.id,
            info: null,
            paths: null,
        }
    }

    componentDidMount() {
        this.getInfo();
        this.getPaths();
    }

    getInfo() {
        const that = this;
        Axios
        .get(`${apiPrefix}/swaggerspec/${this.props.location.query.id}/parse/info`)
        .then(function (response) {
            const obj = response.data;
            let info = new Info(
                obj['title'] == null ? "" : obj['title'],
                obj['version'] == null ? "" : obj['version'],
                obj['description'] == null ? "" : obj['description'],
                obj['basePath'] == null ? "" : obj['basePath'],
                obj['host'] == null ? "" : obj['host'],
            )
            that.setState({
                info: info,
            });
        })
        .catch(function (err) {
            alert(err);
        })
    }

    getPaths() {
        const that = this;
        Axios
        .get(`${apiPrefix}/swaggerspec/${this.props.location.query.id}/parse/paths`)
        .then(function (response) {
            that.setState({
                paths: response.data,
            });
        })
        .catch(function (err) {
            alert(err);
        })
    }

    render() {
        return (
            <div>
                <div>
                    <h3>Info</h3>
                    {JSON.stringify(this.state.info)}
                </div>
                <div>
                    <h3>Paths</h3>
                    {JSON.stringify(this.state.paths)}
                </div>
            </div>
        );
    };
}