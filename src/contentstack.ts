import contentstack from 'contentstack';

const Stack = contentstack.Stack({
  api_key: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
  delivery_token: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
});

export default Stack;
