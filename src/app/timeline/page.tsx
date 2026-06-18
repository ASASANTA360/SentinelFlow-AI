export default function TimelinePage() {

  const events = [
    "Case Created",
    "Document Parsed",
    "Risk Generated",
    "Exception Found",
    "Human Review",
    "Resolved",
  ];

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Timeline
      </h1>

      <div className="space-y-5">

        {events.map((item, index) => (

          <div
            key={index}
            className="glass-card rounded-2xl p-5"
          >
            {item}
          </div>

        ))}

      </div>

    </main>
  );

}