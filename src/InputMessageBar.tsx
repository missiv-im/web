import * as React from "react";
import "./InputMessageBar.css"
// imports shards
import { FormInput, Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
// import icons
import * as Icon from 'react-bootstrap-icons';


function SendButton(){
    return <div className="SendButton">
    <Button className="btn-send" pill><Icon.Send/></Button>
    </div>
}



function InputMessageBar(){
	return <div className="InputMessageBar">
        <div className="bar-container">
		<FormInput className="w-100" placeholder="Ma missive" />
        <SendButton />
		</div>
        </div>
}



export default InputMessageBar;


