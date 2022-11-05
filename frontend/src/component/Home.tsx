import { Carousel } from 'antd';

export const Home = () => {

    return (
        <div style={{width: '960px', height: '540px', margin: '0 auto', backgroundColor: '#001529'}}>
            <Carousel autoplay>
                <div className="carousel" style={{height: '540px'}}>
                    <img
                        src="src/image/rest.png"
                        alt="rest"
                        style={{maxWidth: '100%', height: 'auto', backgroundColor: '#001529'}}
                    />
                </div>
                <div className="center" style={{height: '540px'}}>
                    <img
                        src="src/image/graphql.png"
                        alt="graphql"
                        style={{maxWidth: '100%', height: 'auto', backgroundColor: '#001529'}}
                    />
                </div>
                <div className="center" style={{height: '540px'}}>
                    <img
                        src="src/image/grpc.png"
                        alt="grpc"
                        style={{maxWidth: '960px', height: '540px', backgroundColor: '#001529'}}
                    />
                </div>
            </Carousel>
        </div>
    );
};
