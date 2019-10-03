import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

    function RenderMenuItem({ recording, onClick }) {
        return(
            <Card>
                <Link to={`/menu/${recording._id}`} >
                    <CardImg width="100%" src={baseUrl + recording.image} alt={recording.name} />
                    <CardImgOverlay>
                        <CardTitle>{recording.name}</CardTitle>
                    </CardImgOverlay>
                </Link>
            </Card>
        );
    }

    const Menu = (props) => {

        const menu = props.recordings.recordings.map((recording) => {
            return (
                <div key={recording._id} className="col-12 col-md-5 m-1">
                    <RenderMenuItem recording={recording} />
                </div>
            );
        });

        if (props.recordings.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.recordings.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.recordings.errMess}</h4>
                    </div>
                </div>
            );
        }
        else
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Menu</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>Menu</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        {menu}
                    </div>
                </div>
            );
    }

export default Menu;