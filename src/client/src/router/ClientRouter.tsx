import { PAGE } from '#/config/pages';
import { useAppClientRouting } from '#/contexts/AppClientRoutingContext';
import { ReactNode } from 'react';

type RouterProps = {
    index: ReactNode;
    routes: { route: string; content: ReactNode }[];
};
const Router = ({ index, routes }: RouterProps) => {
    const { route } = useAppClientRouting();
    const content =
        routes.find((item) => item.route === route)?.content || index;

    return <>{content}</>;
};

export const ClientRouter = () => {
    return (
        <Router
            index={<main>index page</main>}
            routes={[{ route: PAGE.index, content: <main>index page</main> }]}
        />
    );
};
