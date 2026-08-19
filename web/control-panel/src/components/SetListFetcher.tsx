import { useState } from "react";

export default function SetListFetcher({ onSelectSet }: { onSelectSet: (set: any) => void }) {
  const [eventUrl, setEventUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "200px",
    alignSelf: "center",
    textAlign: "center",
    padding: "4px",
    marginBottom: "8px"
  };

  function parseEventUrl(url: string) {
    try {
      const parts = url.split("/");
      const tourneyIndex = parts.indexOf("tournament");
      const eventIndex = parts.indexOf("event");

      const tourneySlug = parts[tourneyIndex + 1];
      const eventSlug = parts[eventIndex + 1];

      return { tourneySlug, eventSlug };
    } catch {
      return null;
    }
  }

  async function fetchSets() {
    const parsed = parseEventUrl(eventUrl);
    if (!parsed) return alert("Invalid event URL");

    const { tourneySlug, eventSlug } = parsed;

    setLoading(true);

    try {
      const query = `
        query EventPhaseGroups($tourneySlug: String!, $eventSlug: String!) {
          tournament(slug: $tourneySlug) {
            events(filter: { slug: $eventSlug }) {
              id
              name
              phases {
                id
                name
                phaseGroups {
                  nodes {
                    id
                    displayIdentifier
                    sets(perPage: 50) {
                      nodes {
                        id
                        fullRoundText
                        winnerId
                        stream {
                          streamName
                          streamSource
                        }
                        slots {
                          entrant {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch("https://api.start.gg/gql/alpha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer a819ec45c640e70c235ec04af813b2a7"
        },
        body: JSON.stringify({
          query,
          variables: { tourneySlug, eventSlug }
        })
      });

      const json = await res.json();

      const event = json?.data?.tournament?.events?.[0];
      if (!event) {
        setSets([]);
        return;
      }

      const allSets: any[] = [];

      event.phases?.forEach((phase: any) => {
        phase.phaseGroups?.nodes?.forEach((pg: any) => {
          pg.sets?.nodes?.forEach((set: any) => {
            allSets.push(set);
          });
        });
      });
      const filtered = allSets.filter((s) => {
        // Must be incomplete
        const incomplete = !s.winnerId;

        // Must match stream
        if (!s.stream) return false;
        const name = s.stream.streamName?.toLowerCase() || "";
        const source = s.stream.streamSource?.toLowerCase() || "";
        const target = streamUrl.toLowerCase();
        const matchesStream = name.includes(target) || source.includes(target);

        return incomplete && matchesStream;
      });


      setSets(filtered);
    } catch (err) {
      console.error("Error fetching sets:", err);
      alert("Failed to fetch sets. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 30, textAlign: "center" }}>
      <h2>Fetch Stream Sets</h2>

      <input
        placeholder="Start.gg Event URL"
        value={eventUrl}
        onChange={(e) => setEventUrl(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Stream Name (e.g. NexusEsportsEvents)"
        value={streamUrl}
        onChange={(e) => setStreamUrl(e.target.value)}
        style={inputStyle}
      />

      <button onClick={fetchSets} disabled={loading}>
        {loading ? "Loading..." : "Fetch Sets"}
      </button>

      <div style={{ marginTop: 20 }}>
        {sets.length === 0 && !loading && <p>No sets found.</p>}

        {sets.map((set) => (
          <div
            key={set.id}
            onClick={() => onSelectSet(set)}
            style={{
              marginBottom: 10,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              width: 300,
              marginLeft: "auto",
              marginRight: "auto",
              cursor: "pointer",
              background: "#f8f8f8",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#eaeaea")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8f8f8")}
          >
            <strong>{set.fullRoundText}</strong>
            <br />
            {set.slots.map((slot: any, i: number) => (
              <span key={i}>
                {slot.entrant?.name}
                {i === 0 ? " vs " : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
