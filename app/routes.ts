import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),route('/survey','routes/Survey.tsx'),route('/survey/review','routes/Review.tsx')] satisfies RouteConfig;
