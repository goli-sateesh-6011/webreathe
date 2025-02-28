import { Link, Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Home page" />
            <div className="relative min-h-screen bg-gray-100 bg-center sm:flex sm:justify-center sm:items-center bg-dots-darker  selection:bg-[#186AF6] selection:text-white">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-bold text-center whitespace-pre-line text-neutral-900">
                            Connect all your modules together ! {"\n"}{" "}
                            supercharge your data analysis !
                        </h1>

                        <h2 className="text-lg whitespace-pre-line text-neutral-900">
                            Once you create your account, you can register your
                            module in a matter of seconds !
                        </h2>
                    </div>

                    <div className="flex justify-around">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="font-semibold text-gray-600 hover:text-gray-900  focus:outline focus:outline-2 focus:rounded-sm focus:outline-[#186AF6]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="font-semibold border text-neutral-600  border-[#186AF6] py-2 px-4 rounded-lg hover:rounded-xl duration-100 hover:text-neutral-900"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route("register")}
                                    className="font-semibold border text-neutral-600  border-[#186AF6] py-2 px-4 rounded-lg hover:rounded-xl duration-100 hover:text-neutral-900"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }

            `}</style>
        </>
    );
}
