"user client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { useState } from "react";

export const PublishedNotes = () => {
	const publish = useQuery(api.documents.getPublished);
	const [search, setSearch] = useState("");
	// TODO: get all selected notes
	// const predefined = {}
	// publish?.map((item)=>{
	// 	predefined[item._id = false;
	// })
	// const [selectedDocuments, setSelectedDocuments] = useState<{document: boolean}>({});

	const filteredPublishDocuments = publish?.filter((item) =>
		item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
	);
	console.log(publish);
	
	// const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { value, checked } = e.target;
	// 	setSelectedDocuments({
	// 		...selectedDocuments,
	// 		value: checked,
	// 	})

	// }

	if (!publish) {
		return <Spinner size={"lg"} />;
	}
	return (
		<div className="text-sm">
			<div className="flex items-center gap-x-1 p-2">
				<Search className="h-6 w-6" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
					placeholder="Filter by page title..."
				/>
				<Button variant={"ghost"} size={"sm"}>
					Unpublish
				</Button>
			</div>
			<div className="mt-2 px-1 pb-1">
				<p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
					No published document.
				</p>
				<ul className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg dark:bg-gray-700 dark:text-white">
					{
						filteredPublishDocuments?.map((document) =>
							<li className="w-full rounded-t-lg">
								<div className="flex items-center justify-between w-full px-3" key={document._id}>
									<label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{document.title}</label>
									<input
										type="checkbox"
										value={document.title}
										className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600"
										// onChange={(e) => handleOnChange(e)}
									/>
								</div>
							</li>)
					}
				</ul>
			</div>
		</div>
	);
};
