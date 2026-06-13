interface BattleWonModalProps {
  levelLabel: string
  onContinue: () => void
}

export function BattleWonModal({ levelLabel, onContinue }: BattleWonModalProps) {
  return (
    <div
      data-testid="battle-won-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-center text-2xl font-bold text-green-400 mb-4">Victory!</h2>
        <p className="text-center text-lg mb-6">{levelLabel}</p>
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
