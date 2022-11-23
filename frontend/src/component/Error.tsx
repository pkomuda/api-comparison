import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { useNavigate } from 'react-router-dom';

export const Error = (props: {status: number, description: string}) => {

    const navigate = useNavigate();

    return (
        <Result
            status={props.status as ResultStatusType}
            title={props.status}
            subTitle={props.description}
            extra={<Button type="primary" onClick={() => navigate('/', {replace: true})}>Back Home</Button>}
        />
    );
};
