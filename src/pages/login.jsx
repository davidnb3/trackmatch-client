import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const redirectUri = "http://127.0.0.1:5173/";

  async function loginToSpotify(event) {
    event.preventDefault();

    const clientId = "bcbf898173824f97a8f4d4cfbd642f06";
    // const state = generateRandomString(16);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,

      scope:
        "user-read-private user-read-email playlist-read-private streaming user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing app-remote-control playlist-modify-private playlist-read-collaborative playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played",
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <div className={cn("grid gap-6")}>
          <form onSubmit={loginToSpotify}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </div>
              <Button>Sign In with Spotify</Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
