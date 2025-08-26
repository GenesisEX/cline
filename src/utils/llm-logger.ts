import * as fs from "node:fs/promises"
import * as path from "node:path"

const LOG_DIR = "/tmp/cline/llm_logs"

/**
 * Generates a unique filename using a microsecond timestamp.
 * @returns A string representing the filename.
 */
function generateFilename(): string {
	const now = process.hrtime()
	const microseconds = now[0] * 1_000_000 + Math.floor(now[1] / 1000)
	return `llm_interaction_${microseconds}.log`
}

/**
 * Ensures the log directory exists, creating it if necessary.
 */
async function ensureLogDirectoryExists(): Promise<void> {
	await fs.mkdir(LOG_DIR, { recursive: true })
}

/**
 * Logs an LLM request and its corresponding response to a file.
 * @param request The LLM request content.
 * @param response The LLM response content.
 */
export async function logLLMInteraction(request: string, response: string): Promise<void> {
	try {
		await ensureLogDirectoryExists()
		const filename = generateFilename()
		const filePath = path.join(LOG_DIR, filename)
		const content = `--- LLM Request ---\n${request}\n\n--- LLM Response ---\n${response}\n`
		await fs.writeFile(filePath, content, { encoding: "utf8" })
	} catch (error) {
		console.error("Failed to log LLM interaction:", error)
	}
}
