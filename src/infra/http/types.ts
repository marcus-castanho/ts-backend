export type ReturnValue<T = never> =
    | {
          success: true;
          status: number;
          data: [T] extends [never] ? null : T;
          rawRes: Response;
      }
    | {
          success: false;
          status: number;
          data: null;
          rawRes: Response;
      };

export type Fetch<R, T = never> = [T] extends [never]
    ? () => Promise<ReturnValue<R>>
    : (payload: T) => Promise<ReturnValue<R>>;
