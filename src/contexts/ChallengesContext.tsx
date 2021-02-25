import { useState, useEffect, createContext, ReactNode } from 'react'

import challenges from '../../challenges.json'

interface ChallengesProviderProps {
	children: ReactNode;
}

interface Challenge {
	type: 'body' | 'eye';
	description: string;
	amount: number;
}

interface ChallengesContextData {
	level: number; 
	currentExperience: number; 
	challengesCompleted: number;
	activeChallenge: Challenge;
	experienceToNextLevel: number; 
	levelUp: () => void;
	startNexChallenge: () => void; 
	resetChallenge: () => void;
	completeChallenge: () => void; 
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children }: ChallengesProviderProps) {
	const [level, setLevel] = useState(1)
	const [currentExperience, setCurrentExperience] = useState(0)
	const [challengesCompleted, setChallengesCompleted] = useState(0)
	const [activeChallenge, setActiveChallenge] = useState(null)

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

	useEffect(() => {
		Notification.requestPermission()
	}, [])

	const levelUp = () => {
		setLevel(level + 1)
	}

	const startNexChallenge = () => {
		const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
		const challenge = challenges[randomChallengeIndex]

		setActiveChallenge(challenge)

		new Audio('/notification.mp3').play()

		if (Notification.permission === 'granted') {
			new Notification('Novo desafio!', {
				body: `Valendo ${challenge.amount} xp!`,
				icon: '/favicon.png'
			})
		}
	}

	const resetChallenge = () => {
		setActiveChallenge(null)
	}

	const completeChallenge = () => {
		if (!activeChallenge) return;

		const { amount }  = activeChallenge

		let finalExperience = currentExperience + amount

		if (finalExperience >= experienceToNextLevel) {
			finalExperience = finalExperience - experienceToNextLevel

			levelUp()
		}

		setCurrentExperience(finalExperience)
		setActiveChallenge(null)
		setChallengesCompleted(challengesCompleted + 1)
	}

	return (
		<ChallengesContext.Provider 
			value={{ 
				level, 
				currentExperience, 
				challengesCompleted, 
				levelUp,
				startNexChallenge,
				activeChallenge,
				resetChallenge,
				experienceToNextLevel,
				completeChallenge 
			}}
		>
			{ children }
		</ChallengesContext.Provider>
	)
}