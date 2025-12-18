import type {Route} from './+types/api.graduates';
import {fetchGraduates} from '~/lib/graduates.server';

export async function loader({context}: Route.LoaderArgs) {
  const grads = await fetchGraduates(context);

  // return first 10 for quick testing
  return new Response(JSON.stringify(grads.slice(0, 10), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}