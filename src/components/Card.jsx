export default function Card() {
  return (
    <div className="w-[100%] bg-white shadow-lg rounded-lg overflow-hidden p-4">
      {/* Image */}
      <img
        src="https://images.freeimages.com/images/large-previews/03e/oxford-architecture-1233371.jpg?fmt=webp&w=500"
        alt="Card Image"
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Card Title</h2>
        <p className="text-gray-600">
          This is a brief description of the card. It contains some text about
          the content.
        </p>
      </div>

      {/* Button */}
      <div className="p-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Learn More
        </button>
      </div>
    </div>
  );
}
