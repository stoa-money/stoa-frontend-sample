import { useState } from "react";

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  retryCondition?: (result: T) => boolean,
  addJitter: boolean = false,
  log?: (message: string) => void
): Promise<T> => {
  if (maxRetries < 0) throw new Error("maxRetries must be non-negative");
  if (baseDelay <= 0) throw new Error("baseDelay must be positive");

  const logger = log || ((msg: string) => console.warn(msg));
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      const shouldRetry =
        retryCondition && typeof retryCondition === "function"
          ? retryCondition(result)
          : false;

      if (!shouldRetry) {
        return result;
      }

      if (attempt === maxRetries) {
        const errorMsg = `Max retries reached with unsatisfactory result after ${
          attempt + 1
        } attempts`;
        logger(errorMsg);
      }
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) {
        const errorMsg = `Max retries reached after ${
          attempt + 1
        } attempts. Last error: ${lastError.message}`;
        console.error(errorMsg);
        throw lastError;
      }
    }

    let delay = baseDelay * Math.pow(2, attempt);
    if (addJitter) {
      delay += Math.random() * delay;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    logger(
      `Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`
    );
  }

  throw new Error("Unexpected end of retry loop");
};

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await apiCall();
    } finally {
      setIsLoading(false);
    }
  };

  const withLoadingAndRetry = async <T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    retryCondition?: (result: T) => boolean
  ): Promise<T> => {
    return withLoading(() =>
      retryWithExponentialBackoff(
        apiCall,
        maxRetries,
        baseDelay,
        retryCondition
      )
    );
  };

  return {
    isLoading,
    withLoading,
    withLoadingAndRetry,
    retryWithExponentialBackoff,
  };
}

export type UseApiReturn = ReturnType<typeof useApi>;
