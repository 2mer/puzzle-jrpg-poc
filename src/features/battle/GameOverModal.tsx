interface GameOverModalProps {
  onRetry: () => void
  onBackToMap: () => void
}

export function GameOverModal({ onRetry, onBackToMap }: GameOverModalProps) {
  return (
    <div
      data-testid="game-over-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-center text-2xl font-bold text-red-400 mb-6">Defeat!</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onBackToMap}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition-colors"
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  )
}
