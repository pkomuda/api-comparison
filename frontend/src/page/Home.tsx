import graphql from '@image/graphql.png';
import grpc from '@image/grpc.png';
import rest from '@image/rest.png';
import { Carousel } from 'antd';

export const Home = () => {

    return (
        <div style={{width: '960px', height: '540px', margin: '0 auto', backgroundColor: '#001529'}}>
            <Carousel autoplay>
                <div className="carousel" style={{height: '540px'}}>
                    <img
                        src={rest}
                        alt="rest"
                        style={{maxWidth: '100%', height: 'auto', backgroundColor: '#001529'}}
                    />
                </div>
                <div className="carousel" style={{height: '540px'}}>
                    <img
                        src={graphql}
                        alt="graphql"
                        style={{maxWidth: '100%', height: 'auto', backgroundColor: '#001529'}}
                    />
                </div>
                <div className="carousel" style={{height: '540px'}}>
                    <img
                        src={grpc}
                        alt="grpc"
                        style={{maxWidth: '960px', height: '540px', backgroundColor: '#001529'}}
                    />
                </div>
            </Carousel>
        </div>
    );
};
