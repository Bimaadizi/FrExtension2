import os
import requests
import time

# Directory to save the spell files
save_dir = r"H:\Forgotten realms html\Loremaps\Candlekeep\SPELLS"
os.makedirs(save_dir, exist_ok=True)

# Base URLs
base_api = "https://www.dnd5eapi.co"
spell_list_url = f"{base_api}/api/spells"

# Fetch the list of all spells
print("Fetching list of spells...")
response = requests.get(spell_list_url)
spell_list = response.json().get("results", [])

print(f"Found {len(spell_list)} spells. Downloading...")

for spell in spell_list:
    spell_url = f"{base_api}{spell['url']}"
    try:
        spell_data = requests.get(spell_url).json()

        # Extract relevant fields
        name = spell_data.get("name", "Unknown")
        desc = "\n".join(spell_data.get("desc", []))
        higher = "\n".join(spell_data.get("higher_level", []))
        level = spell_data.get("level", "N/A")
        school = spell_data.get("school", {}).get("name", "Unknown")
        casting_time = spell_data.get("casting_time", "Unknown")
        duration = spell_data.get("duration", "Unknown")
        range_ = spell_data.get("range", "Unknown")
        components = ", ".join(spell_data.get("components", []))
        material = spell_data.get("material", "")
        classes = ", ".join(cls.get("name") for cls in spell_data.get("classes", []))

        filename = f"{name}.txt".replace("/", "-")  # Avoid invalid filename chars
        filepath = os.path.join(save_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"Name: {name}\n")
            f.write(f"Level: {level}\n")
            f.write(f"School: {school}\n")
            f.write(f"Casting Time: {casting_time}\n")
            f.write(f"Range: {range_}\n")
            f.write(f"Duration: {duration}\n")
            f.write(f"Components: {components}\n")
            if material:
                f.write(f"Material: {material}\n")
            f.write(f"Classes: {classes}\n\n")
            f.write("Description:\n")
            f.write(desc + "\n")
            if higher:
                f.write("\nAt Higher Levels:\n")
                f.write(higher + "\n")

        print(f"Saved: {filename}")
        time.sleep(0.1)  # Polite delay

    except Exception as e:
        print(f"Failed to fetch {spell['name']}: {e}")

print("✅ All spells downloaded.")
