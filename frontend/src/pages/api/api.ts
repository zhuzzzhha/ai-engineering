import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cadModelApi = createApi({
  reducerPath: "cadModelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (build) => ({
    createModel: build.query({
      query: (formData) => {
        return {
          url: "/aaaa",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyCreateModelQuery } = cadModelApi;
