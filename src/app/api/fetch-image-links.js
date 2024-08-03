// pages/api/fetch-image-links.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ error: "Name is required" });
	}

	try {
		const { data, error } = supabase.storage
			.from("card")
			.getPublicUrl(`generated_cards/${name}`);
		if (error) throw error;
		res.status(200).json({ url: data.publicUrl });
	} catch (error) {
		console.error("Error fetching image link:", error);
		res.status(500).json({ error: error.message });
	}
}
