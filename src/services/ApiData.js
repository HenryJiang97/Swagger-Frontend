// Generate file data form

import { Col, Form } from "react-bootstrap";

const apiData = (state) => {
    const details = state.fileDetails;
    // console.log(details);
    return (
        <div>
            <Form>
                {/* Info */}
                <Form.Group>
                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={1}>
                            <b>Info</b>
                        </Form.Label>
                    </Form.Group>

                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={2}>
                            Title
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                value={details === null || details.info.title === null ? "" : details.info.title}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={2}>
                            Description
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                value={details === null || details.info.description === null ? "" : details.info.description}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={2}>
                            Version
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                value={details === null || details.info.version === null ? "" : details.info.version}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={2}>
                            API Version
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                value={details === null || details.apiVersion === null ? "" : details.apiVersion}
                            />
                        </Col>
                    </Form.Group>
                </Form.Group>
                
                {/* Paths */}
                <Form.Group>
                    <Form.Group as={Form.Row}>
                        <Form.Label column sm={1}>
                            <b>Paths</b>
                        </Form.Label>
                    </Form.Group>

                    {
                        details === null || details.paths === undefined
                        ?
                        <Form.Group as={Form.Row}>
                            <Form.Label column sm={2}>
                                Nothing
                            </Form.Label>
                        </Form.Group>
                        :
                        Object
                        .keys(details.paths)
                        .map(function(path, titleIdx) {
                            return (
                                <Form.Group>
                                    <Form.Group as={Form.Row}>
                                        <Form.Label column sm={2}>
                                            {`${titleIdx + 1}. ${path}`}
                                        </Form.Label>
                                    </Form.Group>

                                    {
                                        Object
                                        .keys(details.paths[path])
                                        .map(function(method, apiIdx) {
                                            const api = details.paths[path][method];
                                            return (
                                                <Form.Group>
                                                    <Form.Group as={Form.Row}>
                                                        <Form.Label column sm={3}>
                                                            {method}
                                                        </Form.Label>
                                                    </Form.Group>

                                                    {/* Summary */}
                                                    <Form.Group>
                                                        <Form.Group as={Form.Row}>
                                                            <Form.Label column sm={4}>
                                                                Summary:
                                                            </Form.Label>
                                                            <Col sm={6}>
                                                                <Form.Control 
                                                                    value = {api.summary}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                    </Form.Group>

                                                    {/* Parameters */}
                                                    <Form.Group>
                                                        <Form.Group as={Form.Row}>
                                                            <Form.Label column sm={4}>
                                                                Parameters:
                                                            </Form.Label>
                                                        </Form.Group>
                                                    
                                                        {
                                                            api.parameters
                                                            .map(function(param, idx) {
                                                                return (
                                                                    <Form.Group>
                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={4}>
                                                                                {idx + 1}
                                                                            </Form.Label>
                                                                        </Form.Group>
                                                                        {/* Parameter description */}
                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={5}>
                                                                                {param.name + ':'}
                                                                            </Form.Label>
                                                                            <Form.Label column sm={5}>
                                                                                {param.description}
                                                                            </Form.Label>
                                                                        </Form.Group>
                                                                        {/* Parameter type */}
                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={6}>
                                                                                {"Type: "}
                                                                            </Form.Label>
                                                                            <Form.Label column sm={1}>
                                                                                {param.type}
                                                                            </Form.Label>
                                                                        </Form.Group>
                                                                        {/* Parameter format */}
                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={6}>
                                                                                {"Format: "}
                                                                            </Form.Label>
                                                                            <Form.Label column sm={1}>
                                                                                {param.format}
                                                                            </Form.Label>
                                                                        </Form.Group>
                                                                    </Form.Group>
                                                                );
                                                            })
                                                        }
                                                    </Form.Group>

                                                    {/* Responses */}
                                                    <Form.Group>
                                                        <Form.Group as={Form.Row}>
                                                            <Form.Label column sm={4}>
                                                                Responses:
                                                            </Form.Label>
                                                        </Form.Group>

                                                        {
                                                            Object
                                                            .keys(api.responses)
                                                            .map(function(code, codeIdx) {
                                                                const response = api.responses[code];
                                                                return (
                                                                    <Form.Group>
                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={4}>
                                                                                {code}
                                                                            </Form.Label>
                                                                        </Form.Group>

                                                                        <Form.Group as={Form.Row}>
                                                                            <Form.Label column sm={5}>
                                                                                Description: 
                                                                            </Form.Label>
                                                                            <Form.Label column sm={5}>
                                                                                {response.description}
                                                                            </Form.Label>
                                                                        </Form.Group>
                                                                    </Form.Group>
                                                                );
                                                            })
                                                        }
                                                    </Form.Group>
                                                </Form.Group>
                                            );
                                        })
                                    }
                                </Form.Group>
                            );
                        })
                    }
                </Form.Group>
            </Form>
        </div>
    );
}

export {
    apiData,
}