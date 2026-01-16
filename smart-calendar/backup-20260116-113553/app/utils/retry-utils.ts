import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  backoffMultiplier?: number;
}

export function retryWithBackoff<T>(_config: RetryConfig = {}) {
  const { maxRetries = 3, delay = 1000, backoffMultiplier = 2 } = config;

  return (source: Observable<T>) =>
    source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;

            if (retryAttempt > maxRetries) {
              return throwError(() => error);
            }

            const delayTime = delay * Math.pow(backoffMultiplier, index);
            console.log(`Retry attempt ${retryAttempt}/${maxRetries} after ${delayTime}ms`);

            return timer(delayTime);
          })
        )
      )
    );
}
