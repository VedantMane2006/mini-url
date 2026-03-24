import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await fetch(`/api/url/${shortCode}`);
        const data = await res.json();

        if (!res.ok || !data?.data?.originalUrl) {
          throw new Error("Short URL not found");
        }

        // 🔥 actual redirect
        window.location.href = data.data.originalUrl;

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    redirect();
  }, [shortCode]);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-300">
      {!error ? (
        <>
          <p className="text-lg font-semibold">Redirecting...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we take you to your destination
          </p>
        </>
      ) : (
        <>
          <p className="text-red-400 font-semibold text-lg">
            ❌ {error}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The link may be invalid or expired
          </p>
        </>
      )}
    </div>
  );
};

export default RedirectPage;