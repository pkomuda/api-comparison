import { Carousel } from 'antd';

export const Home = () => {

    const size = {width: '960px', height: '540px'};

    return (
        <div style={{...size, margin: '0 auto'}}>
            <Carousel autoplay>
                <div>
                    <img
                        src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/18725/images/DUdzx1kQRdu32TPI69a8_Framing-.jpg"
                        alt="mountains"
                        style={size}
                    />
                </div>
                <div>
                    <img
                        src="https://antongorlin.com/wp-content/uploads/2019/03/picture-of-desert-1280x720.jpg"
                        alt="desert"
                        style={size}
                    />
                </div>
                <div>
                    <img
                        src="https://www.imperiumtapet.com/public/uploads/preview/ocean-20421533977905u7jjsd8d4f.jpg"
                        alt="ocean"
                        style={size}
                    />
                </div>
                <div>
                    <img
                        src="https://wallpaperaccess.com/full/1566449.jpg"
                        alt="jungle"
                        style={size}
                    />
                </div>
            </Carousel>
        </div>
    );
};
