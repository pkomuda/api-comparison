import { Error } from '@component/Error';
import { AuthContext } from '@context/AuthContext';
import { Fragment, ReactNode, useContext } from 'react';

export const PrivateRoute = (props: {accessLevels: string[], children: ReactNode}) => {

    const [auth, ] = useContext(AuthContext);

    return auth.upn && auth.groups.some(group => props.accessLevels.includes(group))
        ? <Fragment>{props.children}</Fragment>
        : <Error status={403} description={"Sorry, you are not authorized to access this page."}/>
};
