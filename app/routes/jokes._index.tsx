import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randRowNum = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randRowNum,
    take: 1,
  });
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here&apos;s a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        &quot;{data.randomJoke.name}&quot; Permalink
      </Link>
      <p>I was wondering why the frisbee was getting bigger, then it hit me.</p>
    </div>
  );
}
